
(function( $ ){

  /**
   * @class HhTileSource
   * @memberof OpenSeadragon
   * @extends OpenSeadragon.TileSource
   * @param {Number|Object} width - the pixel width of the image or the idiomatic
   *      options object which is used instead of positional arguments.
   * @param {Number} height
   * @param {Number} tileSize
   * @param {Number} tileOverlap
   * @param {String} tilesUrl
   * @param {String} fileFormat
   * @param {OpenSeadragon.DisplayRect[]} displayRects
   * @property {String} tilesUrl
   * @property {String} fileFormat
   * @property {OpenSeadragon.DisplayRect[]} displayRects
   */
  $.HhTileSource = function( width, height, tileSize, tileOverlap, tilesUrl, fileFormat, displayRects, minLevel, maxLevel ) {

    var i,
      rect,
      level,
      options;

    if( $.isPlainObject( width ) ){
      options = width;
    }else{
      options = {
        width: arguments[ 0 ],
        height: arguments[ 1 ],
        tileSize: arguments[ 2 ],
        tileOverlap: arguments[ 3 ],
        tilesUrl: arguments[ 4 ],
        fileFormat: arguments[ 5 ],
        displayRects: arguments[ 6 ],
        minLevel: arguments[ 7 ],
        maxLevel: arguments[ 8 ]
      };
    }

    // {"width":110059,"height":60483,"tileSize":254,"tileOverlap":1,"minLevel":null,"maxLevel":null,
    // "tilesUrl":"http://imgs.hh-medic.com/pathology/0/K1703243-%E5%AE%89%E7%8E%89%E9%A6%99_kfb_0/tiles/",
    // "fileFormat":"jpg","displayRects":[],"Image":{"xmlns":"http://schemas.hh-medic.com/deepzoom/2008",
    // "Url":"http://imgs.hh-medic.com/pathology/0/K1703243-%E5%AE%89%E7%8E%89%E9%A6%99_kfb_0/tiles/",
    // "Format":"jpg","DisplayRect":null,"Overlap":1,"TileSize":254,"Size":{"Height":60483,"Width":110059}}}
    // console.log(JSON.stringify(options));

    this._levelRects  = {};
    this.tilesUrl     = options.tilesUrl;
    this.fileFormat   = options.fileFormat;
    this.displayRects = options.displayRects;

    if ( this.displayRects ) {
      // console.log(this.displayRects);
      for ( i = this.displayRects.length - 1; i >= 0; i-- ) {
        rect = this.displayRects[ i ];
        for ( level = rect.minLevel; level <= rect.maxLevel; level++ ) {
          if ( !this._levelRects[ level ] ) {
            this._levelRects[ level ] = [];
          }
          this._levelRects[ level ].push( rect );
        }
      }
      // console.log(this._levelRects);
    }

    // console.log('hh tile init');
    // console.log(JSON.stringify(options));
    options.minLevel = 11;
    options.maxLevel = 16;

    $.TileSource.apply( this, [ options ] );

  };

  $.extend( $.HhTileSource.prototype, $.TileSource.prototype, /** @lends OpenSeadragon.HhTileSource.prototype */{


    /**
     * Determine if the data and/or url imply the image service is supported by
     * this tile source.
     * @function
     * @param {Object|Array} data
     * @param {String} optional - url
     */
    supports: function( data, url ){
      var ns;
      if ( data.Image ) {
        ns = data.Image.xmlns;
      } else if ( data.documentElement) {
        if ("Image" == data.documentElement.localName || "Image" == data.documentElement.tagName) {
          ns = data.documentElement.namespaceURI;
        }
      }

      return ( "http://schemas.hh-medic.com/deepzoom/2008" == ns ||
      "http://schemas.hh-medic.com.com/deepzoom/2009" == ns );
    },

    /**
     *
     * @function
     * @param {Object|XMLDocument} data - the raw configuration
     * @param {String} url - the url the data was retreived from if any.
     * @return {Object} options - A dictionary of keyword arguments sufficient
     *      to configure this tile sources constructor.
     */
    configure: function( data, url ){

      var options;

      if( !$.isPlainObject(data) ){
        // console.log("xml")
        options = configureFromXML( this, data );

      }else{
        // console.log('obj')
        options = configureFromObject( this, data );
      }

      // console.log(JSON.stringify(options));


      // console.log('url:'+url);
      if (url && !options.tilesUrl) {
        // console.log('hh tilesUrl....');
        options.tilesUrl = url.replace(/([^\/]+)\.(dzi|xml|js)(\?.*|$)/, '$1_files/');

        if (url.search(/\.(dzi|xml|js)\?/) != -1) {
          options.queryParams = url.match(/\?.*/);
        }else{
          options.queryParams = '';
        }
      }

      // console.log(options.tilesUrl);

      return options;
    },


    /**
     * @function
     * @param {Number} level
     * @param {Number} x
     * @param {Number} y
     */
    getTileUrl: function( level, x, y ) {
      if(level-10<1)
        return this.tilesUrl + "large.jpg";
      return [ this.tilesUrl,'tiles','/', level-10, '/', x, '_', y, '.', this.fileFormat, this.queryParams ].join( '' );
    },


    /**
     * @function
     * @param {Number} level
     * @param {Number} x
     * @param {Number} y
     */
    tileExists: function( level, x, y ) {
      var rects = this._levelRects[ level ],
        rect,
        scale,
        xMin,
        yMin,
        xMax,
        yMax,
        i;

      // console.log(level);
      // console.log(x);
      // console.log(y);

      if ( !rects || !rects.length ) {
        return true;
      }

      for ( i = rects.length - 1; i >= 0; i-- ) {
        rect = rects[ i ];

        if ( level < rect.minLevel || level > rect.maxLevel ) {
          continue;
        }

        scale = this.getLevelScale( level );
        xMin = rect.x * scale;
        yMin = rect.y * scale;
        xMax = xMin + rect.width * scale;
        yMax = yMin + rect.height * scale;

        xMin = Math.floor( xMin / this.tileSize );
        yMin = Math.floor( yMin / this.tileSize );
        xMax = Math.ceil( xMax / this.tileSize );
        yMax = Math.ceil( yMax / this.tileSize );

        if ( xMin <= x && x < xMax && yMin <= y && y < yMax ) {
          return true;
        }
      }

      return false;
    }
  });


  /**
   * @private
   * @inner
   * @function
   */
  function configureFromXML( tileSource, xmlDoc ){

    if ( !xmlDoc || !xmlDoc.documentElement ) {
      throw new Error( $.getString( "Errors.Xml" ) );
    }

    var root           = xmlDoc.documentElement,
      rootName       = root.localName || root.tagName,
      ns             = xmlDoc.documentElement.namespaceURI,
      configuration  = null,
      displayRects   = [],
      dispRectNodes,
      dispRectNode,
      rectNode,
      sizeNode,
      i;

    if ( rootName == "Image" ) {

      try {
        sizeNode = root.getElementsByTagName("Size" )[ 0 ];
        if (sizeNode === undefined) {
          sizeNode = root.getElementsByTagNameNS(ns, "Size" )[ 0 ];
        }

        configuration = {
          Image: {
            xmlns:       "http://schemas.hh-medic.com/deepzoom/2008",
            Url:         root.getAttribute( "Url" ),
            Format:      root.getAttribute( "Format" ),
            DisplayRect: null,
            Overlap:     parseInt( root.getAttribute( "Overlap" ), 10 ),
            TileSize:    parseInt( root.getAttribute( "TileSize" ), 10 ),
            Size: {
              Height: parseInt( sizeNode.getAttribute( "Height" ), 10 ),
              Width:  parseInt( sizeNode.getAttribute( "Width" ), 10 )
            },
          }
        };

        if ( !$.imageFormatSupported( configuration.Image.Format ) ) {
          throw new Error(
            $.getString( "Errors.ImageFormat", configuration.Image.Format.toUpperCase() )
          );
        }

        dispRectNodes = root.getElementsByTagName("DisplayRect" );
        if (dispRectNodes === undefined) {
          dispRectNodes = root.getElementsByTagNameNS(ns, "DisplayRect" )[ 0 ];
        }

        console.log(dispRectNodes.length)

        for ( i = 0; i < dispRectNodes.length; i++ ) {
          dispRectNode = dispRectNodes[ i ];
          rectNode     = dispRectNode.getElementsByTagName("Rect" )[ 0 ];
          if (rectNode === undefined) {
            rectNode = dispRectNode.getElementsByTagNameNS(ns, "Rect" )[ 0 ];
          }

          displayRects.push({
            Rect: {
              X: parseInt( rectNode.getAttribute( "X" ), 10 ),
              Y: parseInt( rectNode.getAttribute( "Y" ), 10 ),
              Width: parseInt( rectNode.getAttribute( "Width" ), 10 ),
              Height: parseInt( rectNode.getAttribute( "Height" ), 10 ),
              MinLevel: parseInt( dispRectNode.getAttribute( "MinLevel" ), 10 ),
              MaxLevel: parseInt( dispRectNode.getAttribute( "MaxLevel" ), 10 )
            }
          });
        }

        if( displayRects.length ){
          configuration.Image.DisplayRect = displayRects;
        }

        //   console.log(tileSource)
        // console.log(configuration)

        return configureFromObject( tileSource, configuration );

      } catch ( e ) {
        throw (e instanceof Error) ?
          e :
          new Error( $.getString("Errors.Dzi") );
      }
    } else if ( rootName == "Collection" ) {
      throw new Error( $.getString( "Errors.Dzc" ) );
    } else if ( rootName == "Error" ) {
      return $._processDZIError( root );
    }

    throw new Error( $.getString( "Errors.Dzi" ) );
  }

  /**
   * @private
   * @inner
   * @function
   */
  function configureFromObject( tileSource, configuration ){
    var imageData     = configuration.Image,
      tilesUrl      = imageData.Url,
      fileFormat    = imageData.Format,
      sizeData      = imageData.Size,
      dispRectData  = imageData.DisplayRect || [],
      width         = parseInt( sizeData.Width, 10 ),
      height        = parseInt( sizeData.Height, 10 ),
      tileSize      = parseInt( imageData.TileSize, 10 ),
      tileOverlap   = parseInt( imageData.Overlap, 10 ),
      displayRects  = [],
      rectData,
      i;

    //TODO: need to figure out out to better handle image format compatibility
    //      which actually includes additional file formats like xml and pdf
    //      and plain text for various tilesource implementations to avoid low
    //      level errors.
    //
    //      For now, just don't perform the check.
    //
    /*if ( !imageFormatSupported( fileFormat ) ) {
     throw new Error(
     $.getString( "Errors.ImageFormat", fileFormat.toUpperCase() )
     );
     }*/

    for ( i = 0; i < dispRectData.length; i++ ) {
      rectData = dispRectData[ i ].Rect;

      displayRects.push( new $.DisplayRect(
        parseInt( rectData.X, 10 ),
        parseInt( rectData.Y, 10 ),
        parseInt( rectData.Width, 10 ),
        parseInt( rectData.Height, 10 ),
        parseInt( rectData.MinLevel, 10 ),
        parseInt( rectData.MaxLevel, 10 )
      ));
    }

    //   console.log(tilesUrl);
    //
    // var x1 = $.extend(true, {
    //   width: width, /* width *required */
    //   height: height, /* height *required */
    //   tileSize: tileSize, /* tileSize *required */
    //   tileOverlap: tileOverlap, /* tileOverlap *required */
    //   minLevel: null, /* minLevel */
    //   maxLevel: null, /* maxLevel */
    //   tilesUrl: tilesUrl, /* tilesUrl */
    //   fileFormat: fileFormat, /* fileFormat */
    //   displayRects: displayRects /* displayRects */
    // }, configuration );
    // console.log(x1)
    //
    // console.log(tilesUrl)

    var o = $.extend(true, {
      width: width, /* width *required */
      height: height, /* height *required */
      tileSize: tileSize, /* tileSize *required */
      tileOverlap: tileOverlap, /* tileOverlap *required */
      minLevel: null, /* minLevel */
      maxLevel: null, /* maxLevel */
      tilesUrl: tilesUrl, /* tilesUrl */
      fileFormat: fileFormat, /* fileFormat */
      displayRects: displayRects /* displayRects */
    }, configuration );
    // console.log(JSON.stringify(o));
    return o;

  }

}( OpenSeadragon ));
