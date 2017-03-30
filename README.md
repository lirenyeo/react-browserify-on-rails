# React and Browserify on Rails
===================================
Using browserify-rails gem to hook up other NPM packages to Rails Asset Pipeline.

react-rails gem here is used for its 'react_ujs' view helpers, which means we do not directly //= require react, but require() them through npm packages.


Sources

https://collectiveidea.com/blog/archives/2016/04/13/rails-react-npm-without-the-pain
https://collectiveidea.com/blog/archives/2016/03/09/modern-javascript-and-rails
https://gist.github.com/oelmekki/c78cfc8ed1bba0da8cee#file-doc-md


# Rails + Browserify + React + ES7
==================================

## 1. Gemfile

```ruby
gem 'browserify-rails', '1.5.0' # until fix: https://github.com/browserify-rails/browserify-rails/issues/101
gem 'react-rails'
```

Browserify-rails allows to use browserify within assets pipeline. React-rails is here only to allow to use `#react_component` (and thus, prerendering).

Note that `jquery-rails` can be removed from Gemfile, the npm version of `jquery` and `jquery-ujs` will be used instead.


## 2. package.json

Here is a typical package json for es7 + react + rails:

Versions may need update. [npm-check](https://www.npmjs.com/package/npm-check) is killing it for that.

```json
{
  "name": "my app",
  "dependencies": {
    "babel-plugin-syntax-async-functions": "^6.3.13",
    "babel-plugin-transform-regenerator": "^6.3.18",
    "babel-polyfill": "^6.3.14",
    "babel-preset-es2015": "^6.3.13",
    "babel-preset-react": "^6.3.13",
    "babel-preset-stage-0": "^6.3.13",
    "babelify": "^7.2.0",
    "browserify": "^12.0.1",
    "browserify-incremental": "^3.0.1",
    "es6-promise": "^3.0.2",
    "fetch": "^0.3.6",
    "jquery": "^2.1.4",
    "jquery-ujs": "^1.0.4",
    "react": "^0.14.3",
  },
  "license": "MIT",
  "engines": {
    "node": ">= 0.10"
  },
  "devDependencies": {
    "babelify": "^7.2.0"
  }
}
```

The `fetch` plugin is a polyfill that allows to use [fetch](https://developer.mozilla.org/en/docs/Web/API/Fetch_API) in any browser.

To add a js plugin in your application, simply add a line in the `dependencies` object and run `npm-check -u` (or `npm install` if you don't like sexyness).


## 3. `config/application.rb`

Add at the end of `Application` class:

```ruby
config.browserify_rails.commandline_options = "-t [ babelify --presets [ es2015 react stage-0 ] --plugins [ syntax-async-functions transform-regenerator ] ]"
```

* `es2015` and `stage-0` babel presets allow to parse cutting edge es7
* `react` babel preset allows to parse jsx
* `syntax-async-function` and `transform-regenerator` allow to use es7 async functions


## 4. `app/assets/javascripts/application.js`

```js
//= require_self
//= require react-server
//= require react_ujs

window.$ = window.jQuery = global.$ = require('jquery');
var React = window.React = global.React = require('react');
require( 'jquery-ujs' );
require( 'fetch' );
require( './components' );
```

Sprockets is only used to require current script and helpers from `react-rails`. All other files will be imported using browserify.


## 5. `app/assets/javascripts/components.js`

```
require( 'babel-polyfill' );

global.MyFirstComponent = require( 'components/my_first_component' ).default;
global.MySecondComponent = require( 'components/my_second_component' ).default;
```

This is the central requiring script, that will load all files in the pipeline. Think of it as this root file in ruby gems that just require all the other files (although, I prefer to only require root components, and let them require further subcomponents they need).

A few remarks:

* this is in `components.js` rather than `application.js`, because this is the file server side prerendering will load. Anything declared in `application.js` won't be available to prerendering
* requiring `babel-polyfill` is mandatory to use es7 async functions
* for a reason I don't understand, it is not possible to use the es7 `import` syntax in that root file, so you have to use `require(...).default` instead


## 6. write some es7 code \o/

Here is an example:

```jsx
// app/assets/javascripts/components/hello_world.js

import Title      from 'components/title';
import LoremIpsum from 'components/lorem_ipsum';

var propTypes = {
  name: React.PropTypes.string.isRequired,
};

export default class HelloWorld extends React.Component {
  constructor( props ){
    super( props );
    this.state = { name: this.props.name };
  }

  changeName = async () => {
    let resp = await fetch( '/get_new_name' );
    resp = await resp.json();
    this.setState({ name: resp.name });
  }

  render(){
    return (
      <div onClick={this.changeName}>
        <Title>Hello {this.state.name}!</Title>
        <LoremIpsum />
      </div>
    );
  }
}

HelloWorld.propTypes = propTypes;
```

Do not forget to require this file in your `component.js`:

```js
global.HelloWorld = require( 'components/hello_world' ).default;
```


## 7. load the component in view

From here, it's just stuff as usual:

```haml
.container
  .row
    .col-md-12
      = react_component 'HelloWorld', { name: current_user.name }, prerender: true
```