define([
	"dojo/_base/declare",
	"dojo/parser", 
	"dojo/ready",
	"dojo/_base/lang",
	"dojo/Evented",
	"dijit/_WidgetBase", 
	"app/config",
	"esri/views/MapView", 
	"esri/WebMap",
    "esri/geometry/Circle", 
    "esri/symbols/SimpleFillSymbol", 
    "esri/Graphic"
], function(declare, parser, ready, lang, Evented, _WidgetBase, config, MapView, WebMap, Circle, SimpleFillSymbol, Graphic){
        return declare([_WidgetBase, Evented], {
        	// Properties
        	view: null,
        	srcNodeRef: null,
        	symbol: new SimpleFillSymbol({
				color: null,
				outline: {
					color: "blue"
				}
			}),
        	
            /*
             * Creates an instance of the map
             */
            constructor: function(params, srcNodeRef) {
            	this.srcNodeRef = srcNodeRef;
            },
            
            /*
             * Handler called once the layout has been created
             */
            postCreate: function() {
            	// Call the base class methods
            	this.inherited(arguments);    

				// Create our map
				this.init();
            },
            
            /*
             * Creates the map
             */
            init: function() {
            	var webmap = new WebMap({
        			portalItem: { 
          				id: config.webmapId
        			}
      			});
      			
      			// Create the view
      			this.view = new MapView({
        			map: webmap,
        			container: this.srcNodeRef
      			});
      			
      			// Disable webmap popups
      			this.view.popup = null;
      			
      			this.view.then(lang.hitch(this, function() {
      				this.own(this.view.on("click", lang.hitch(this, this.drawCircle)));
					this.emit("load", {});
      			}));
			},

            /*
             * Draw a circle on the map
             */			
			drawCircle: function(e) {
				var circle, radius, view = this.view;
					
				// Clear existing grahics
		    	view.graphics.removeAll();
		    	
		    	radius = view.extent.width / 10;
          		circle = new Circle({
            		center: e.mapPoint,
            		radius: radius
          		});
          		
          		view.graphics.add(new Graphic(circle, this.symbol));
			}
        });
        
        ready(function(){
        	parser.parse();
    	});
	}
);