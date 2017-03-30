/* Default if install through `rails g install:react`
    require_tree ./components
************************************************** */

// Manually add components to window and global
// so that react_ujs and react-server can find them and render them.

// requiring babel-polyfill is mandatory to use es7 async functions
require( 'babel-polyfill' );

window.TestComponent = global.TestComponent = require("./components/test_component.jsx").default

