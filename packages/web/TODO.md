Flow web interface:

* [x] User can create nodes
  - [x] User can press spacebar to see toolbar with avalable node types
  - [x] Node is created when user let go spacebar while hovering any of node types
* [ ] User can edit node
  - [ ] User can change node label
  - [ ] Chart is rerendered when node value is changed
* [x] User can drag nodes
  - [x] User can see grid background
  - [x] User can drag and drop nodes
  - [x] User can snap nodes to the grid when dragging
  - [x] Node position is updated in mobx store
* [ ] User can link nodes
  - [ ] User can hover node to see Connector Point
  - [ ] User can click on Connector Point to start drawing a link with other node
  - [ ] Link is created when user stops dragging while hovering on other node
* [x] User can zoom and pan
  - [x] User can pan
  - [x] User can zoom
  - [x] Grid is filling whole svg when user pans or zooms
* [ ] User can see minimap
  - [ ] User can see minimap in top right corner
  - [ ] User can click on minimap to scoll selected part into view
* [ ] Layout


Inspiration:
  - https://code.blender.org/wp-content/uploads/2012/01/node_group_interface18.png
  - https://i.imgur.com/MlULocL.png
  - https://apis.guru/graphql-voyager/
