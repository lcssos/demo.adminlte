import { Component, OnInit } from '@angular/core';

declare var OpenSeadragon: any;

@Component({
  selector: 'app-openslide',
  templateUrl: './openslide.component.html',
  styleUrls: ['./openslide.component.css']
})
export class OpenslideComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    require('./static/openseadragon.js');
    require('./static/openseadragon-scalebar.js');


    var viewer = new OpenSeadragon({
      id: "view",
      prefixUrl: "/assets/openslide/",
      timeout: 120000,
      animationTime: 0.5,
      blendTime: 0.1,
      constrainDuringPan: true,
      maxZoomPixelRatio: 2,
      minZoomLevel: 1,
      visibilityRatio: 1,
      zoomPerScroll: 2,
    });

    viewer.addHandler("open", function() {
      viewer.source.minLevel = 8;
    });
    viewer.scalebar({
      xOffset: 10,
      yOffset: 10,
      barThickness: 3,
      color: '#555555',
      fontColor: '#333333',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
    });

    open_slide("slide.dzi", parseFloat('0'),viewer);

    $(".load-slide").click(function(ev) {
      $(".current-slide").removeClass("current-slide");
      $(this).parent().addClass("current-slide");
      open_slide($(this).attr('data-url'),parseFloat($(this).attr('data-mpp')), viewer);
      ev.preventDefault();
    });

  }



}


let dzi_data11 = {"slide.dzi": "<?xml version='1.0' encoding='UTF-8'?>\n<Image Url=\"/slide_files/\" Format=\"jpeg\" Overlap=\"1\" TileSize=\"254\" xmlns=\"http://schemas.microsoft.com/deepzoom/2008\"><Size Height=\"210579\" Width=\"94968\" /></Image>"};


function open_slide(url, mpp,viewer) {
  var tile_source;
  if (dzi_data11[url]) {
    // DZI XML provided as template argument (deepzoom_tile.py)
    tile_source = new OpenSeadragon.DziTileSource(
      OpenSeadragon.DziTileSource.prototype.configure(
        OpenSeadragon.parseXml(dzi_data11[url]), url));
  } else {
    // DZI XML fetched from server (deepzoom_server.py)
    tile_source = url;
  }
  viewer.open(tile_source);
  viewer.scalebar({
    pixelsPerMeter: mpp ? (1e6 / mpp) : 0,
  });
}
