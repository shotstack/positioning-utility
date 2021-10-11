var resolutions = {
  sd: {
    '16:9': {
      width: 1024,
      height: 576,
    },
    '9:16': {
      width: 576,
      height: 1024,
    },
    '1:1': {
      width: 576,
      height: 576,
    },
    '4:5': {
      width: 576,
      height: 720,
    },
  },
  hd: {
    '16:9': {
      width: 1280,
      height: 720,
    },
    '9:16': {
      width: 720,
      height: 1280,
    },
    '1:1': {
      width: 720,
      height: 720,
    },
    '4:5': {
      width: 720,
      height: 900,
    },
  },
  1080: {
    '16:9': {
      width: 1920,
      height: 1080,
    },
    '9:16': {
      width: 1080,
      height: 1920,
    },
    '1:1': {
      width: 1080,
      height: 1080,
    },
    '4:5': {
      width: 1080,
      height: 1350,
    },
  },
};

var htmlEdit = {
  timeline: {
    background: '#FFFFFF',
    tracks: [{
      clips: [{
        asset: {
          type: 'html',
          html: '<div></div>',
          width: 100,
          height: 100,
          background: '#25d3d0',
        },
        start: 0,
        length: 5,
        offset: {
          x: 0,
          y: 0,
        },
      }],
    }],
  },
  output: {
    format: 'png',
    resolution: 'sd',
  },
};

var mediaEdit = {
  timeline: {
    background: '#FFFFFF',
    tracks: [{
      clips: [{
        asset: {
          type: 'image',
          src: 'https://shotstack-assets.s3.amazonaws.com/logos/shotstack/icon.png',
        },
        start: 0,
        length: 5,
        scale: 1,
        fit: 'none',
        offset: {
          x: 0,
          y: 0,
        },
      }],
    }],
  },
  output: {
    format: 'png',
    resolution: 'sd',
  },
};

var stage;
var layer;
var shape;
var tr;
var edit;
var selectionRectangle;

var viewportDimensions = {
  width: 0,
  height: 0,
};

var dimensions = {
  width: 187,
  height: 223,
};

// Load placeholder image
var imageObj = new Image();

var codeMirror = CodeMirror(document.getElementById('editor'), {
  mode: {
    name: 'javascript',
    json: true,
  },
  theme: 'lucario',
  keyMap: 'sublime',
  autoCloseBrackets: true,
  matchBrackets: true,
  lineNumbers: true,
  indentUnit: 4,
  readOnly: true,
});

// Update JSON contents
function updateJson() {
  var doc = codeMirror.getDoc();
  doc.setValue(JSON.stringify(edit, null, 2));
}

function getImageMetadata(url, callback) {
  var encodedUrl = encodeURIComponent(url);
  $.ajax({
    url: `https://api.shotstack.io/edit/v1/probe/${encodedUrl}`,
    beforeSend() {
      $('#error').addClass('hidden');
      $('#media-submit .icon').html('<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle-notch" class="svg-inline--fa fa-circle-notch w-4 animate-spin" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M512 256c0 141.2-114.8 256-256 256s-256-114.8-256-256c0-112.4 75.19-213.4 182.9-245.4c16.94-5.047 34.75 4.641 39.78 21.55c5.062 16.94-4.594 34.75-21.53 39.8C120.4 95.97 64 171.7 64 256c0 105.9 86.13 192 192 192s192-86.13 192-192c0-84.34-56.38-160-137.1-184c-16.94-5.047-26.59-22.86-21.53-39.8c5.031-16.91 22.84-26.56 39.78-21.55C436.8 42.64 512 143.6 512 256z"></path></svg>');
      $('#media-submit .icon-text').html('Loading');
    },
    success: (data) => {
      dimensions = {
        width: data.response.metadata.streams[0].width,
        height: data.response.metadata.streams[0].height,
      };
      $('#error').addClass('hidden');
      $('#media-submit .icon').html('<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle-down" class="svg-inline--fa fa-circle-down w-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 512c141.4 0 256-114.6 256-256s-114.6-256-256-256C114.6 0 0 114.6 0 256S114.6 512 256 512zM129.2 265.9C131.7 259.9 137.5 256 144 256h64V160c0-17.67 14.33-32 32-32h32c17.67 0 32 14.33 32 32v96h64c6.469 0 12.31 3.891 14.78 9.875c2.484 5.984 1.109 12.86-3.469 17.44l-112 112c-6.248 6.248-16.38 6.248-22.62 0l-112-112C128.1 278.7 126.7 271.9 129.2 265.9z"></path></svg>');
      $('#media-submit .icon-text').html('Download');
      callback(dimensions);
    },
    error: (jqXHR) => {
      $('#error').removeClass('hidden');
      $('.error-message').text(jqXHR.responseJSON.message);
      $('.error-description').text(jqXHR.responseJSON.response);
      $('#media-submit .icon').html('<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle-down" class="svg-inline--fa fa-circle-down w-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 512c141.4 0 256-114.6 256-256s-114.6-256-256-256C114.6 0 0 114.6 0 256S114.6 512 256 512zM129.2 265.9C131.7 259.9 137.5 256 144 256h64V160c0-17.67 14.33-32 32-32h32c17.67 0 32 14.33 32 32v96h64c6.469 0 12.31 3.891 14.78 9.875c2.484 5.984 1.109 12.86-3.469 17.44l-112 112c-6.248 6.248-16.38 6.248-22.62 0l-112-112C128.1 278.7 126.7 271.9 129.2 265.9z"></path></svg>');
      $('#media-submit .icon-text').html('Download');
    },
  });
}

function setCanvasHeight(aspectRatio) {
  var height;
  switch (aspectRatio) {
    case '16:9':
      height = $('#viewport').width() * (9 / 16);
      break;
    case '9:16':
      height = $('#viewport').width() * (16 / 9);
      break;
    case '1:1':
      height = $('#viewport').width() * (1);
      break;
    case '4:5':
      height = $('#viewport').width() * (5 / 4);
      break;
    default:
      break;
  }
  return height;
}

function calculateOffset(x, y) {
  var position = $('#position').val();
  var rectWidth = (shape.attrs.scaleX) ? shape.width() * shape.attrs.scaleX : shape.width();
  var rectHeight = (shape.attrs.scaleY) ? shape.height() * shape.attrs.scaleY : shape.height();
  var offsetX; var offsetY;
  switch (position) {
    case 'center':
      offsetX = (((x - (stage.width() / 2)) + (rectWidth / 2)) / stage.width()).toFixed(4);
      offsetY = (-((y - (stage.height() / 2)) + (rectHeight / 2)) / stage.height()).toFixed(4);
      break;
    case 'top':
      offsetX = (((x - (stage.width() / 2)) + (rectWidth / 2)) / stage.width()).toFixed(4);
      offsetY = (-y / stage.height()).toFixed(4);
      break;
    case 'topRight':
      offsetX = ((x - stage.width() + rectWidth) / stage.width()).toFixed(4);
      offsetY = (-y / stage.height()).toFixed(4);
      break;
    case 'right':
      offsetX = ((x - stage.width() + rectWidth) / stage.width()).toFixed(4);
      offsetY = (-((y - (stage.height() / 2)) + (rectHeight / 2)) / stage.height()).toFixed(4);
      break;
    case 'bottomRight':
      offsetX = ((x - stage.width() + rectWidth) / stage.width()).toFixed(4);
      offsetY = (-y + stage.height() - rectHeight) / stage.height();
      break;
    case 'bottom':
      offsetX = (((x - (stage.width() / 2)) + (rectWidth / 2)) / stage.width()).toFixed(4);
      offsetY = (-y + stage.height() - rectHeight) / stage.height();
      break;
    case 'bottomLeft':
      offsetX = (x / stage.width()).toFixed(4);
      offsetY = (-y + stage.height() - rectHeight) / stage.height();
      break;
    case 'left':
      offsetX = (x / stage.width()).toFixed(4);
      offsetY = (-((y - (stage.height() / 2)) + (rectHeight / 2)) / stage.height()).toFixed(4);
      break;
    case 'topLeft':
      offsetX = (x / stage.width()).toFixed(4);
      offsetY = (-y / stage.height()).toFixed(4);
      break;
    default:
      break;
  }
  edit.timeline.tracks[0].clips[0].offset.x = parseFloat(offsetX);
  edit.timeline.tracks[0].clips[0].offset.y = parseFloat(offsetY);
}

function resetPosition() {
  var rectWidth = (shape.attrs.scaleX) ? shape.width() * shape.attrs.scaleX : shape.width();
  var rectHeight = (shape.attrs.scaleY) ? shape.height() * shape.attrs.scaleY : shape.height();
  var position = $('#position').val();
  var x; var y;
  switch (position) {
    case 'center':
      x = (stage.width() / 2) - (rectWidth / 2);
      y = (stage.height() / 2) - (rectHeight / 2);
      break;
    case 'top':
      x = (stage.width() / 2) - (rectWidth / 2);
      y = 0;
      break;
    case 'topRight':
      x = stage.width() - rectWidth;
      y = 0;
      break;
    case 'right':
      x = stage.width() - rectWidth;
      y = (stage.height() / 2) - (rectHeight / 2);
      break;
    case 'bottomRight':
      x = stage.width() - rectWidth;
      y = stage.height() - rectHeight;
      break;
    case 'bottom':
      x = (stage.width() / 2) - (rectWidth / 2);
      y = stage.height() - rectHeight;
      break;
    case 'bottomLeft':
      x = 0;
      y = stage.height() - rectHeight;
      break;
    case 'left':
      x = 0;
      y = (stage.height() / 2) - (rectHeight / 2);
      break;
    case 'topLeft':
      x = 0;
      y = 0;
      break;
    default:
      break;
  }

  shape.x(x);
  shape.y(y);
  edit.timeline.tracks[0].clips[0].offset.x = 0;
  edit.timeline.tracks[0].clips[0].offset.y = 0;

  updateJson();
}

function setSelectionRectangle() {
  if (tr) tr.nodes([]);
  if (selectionRectangle) selectionRectangle.destroy();

  tr = new Konva.Transformer({
    keepRatio: true,
    rotateEnabled: false,
  });
  if ($('input[name="asset-type"]:checked').val() === 'image') tr.enabledAnchors(['top-left', 'top-right', 'bottom-left', 'bottom-right']);
  layer.add(tr);

  // by default select all shapes
  tr.nodes([shape]);

  // add a new feature, vars add ability to draw selection rectangle
  selectionRectangle = new Konva.Rect({
    fill: 'rgba(0,0,255,0.5)',
    visible: false,
  });
  layer.add(selectionRectangle);

  shape.on('transform', () => {
    var newWidth = Math.round(shape.width() * shape.scaleX());
    var newHeight = Math.round(shape.height() * shape.scaleY());
    var resolution = resolutions[$('#resolution').val()][$('#aspect-ratio').val()];
    if ($('input[name="asset-type"]:checked').val() === 'image') {
      edit.timeline.tracks[0].clips[0].scale = parseFloat((newWidth / imageObj.width).toFixed(4));
      updateJson();
    } else if ($('input[name="asset-type"]:checked').val() === 'html') {
      jsonWidth = (resolution.width * newWidth) / stage.width();
      jsonHeight = (resolution.height * newHeight) / stage.height();
      edit.timeline.tracks[0].clips[0].asset.width = Math.floor(jsonWidth);
      edit.timeline.tracks[0].clips[0].asset.height = Math.floor(jsonHeight);
      updateJson();
    }
  });

  shape.on('transformend', () => {
    calculateOffset(shape.attrs.x, shape.attrs.y, stage.width(), stage.height());
    updateJson();
  });
}

function imageStage() {
  var resolution = resolutions[$('#resolution').val()][$('#aspect-ratio').val()];
  edit = mediaEdit;
  edit.timeline.tracks[0].clips[0].asset.src = $('#media-url').val();

  imageObj.width = (dimensions.width / resolution.width) * stage.width();
  imageObj.height = (dimensions.height / resolution.height) * stage.height();

  shape = new Konva.Image({
    image: imageObj,
    x: 0,
    y: 0,
    name: 'rect',
    draggable: true,
  });

  calculateOffset(shape.attrs.x, shape.attrs.y);

  updateJson();
  layer.add(shape);
}

function htmlStage() {
  var resolution = resolutions[$('#resolution').val()][$('#aspect-ratio').val()];
  var htmlHeight = (100 / resolution.height) * stage.height();
  var htmlWidth = (100 / resolution.width) * stage.width();
  edit = htmlEdit;

  shape = new Konva.Rect({
    x: 0,
    y: 0,
    width: htmlWidth,
    height: htmlHeight,
    fill: $('#html-background').val(),
    name: 'rect',
    draggable: true,
  });

  calculateOffset(shape.attrs.x, shape.attrs.y);

  updateJson();
  layer.add(shape);
}

function initiateEventHandlers() {
  var x1;
  var y1;
  var x2;
  var
    y2;
  stage.on('mousedown touchstart', (e) => {
    // do nothing if we mousedown on any shape
    if (e.target !== stage) {
      return;
    }
    x1 = stage.getPointerPosition().x;
    y1 = stage.getPointerPosition().y;
    x2 = stage.getPointerPosition().x;
    y2 = stage.getPointerPosition().y;

    selectionRectangle.visible(true);
    selectionRectangle.width(0);
    selectionRectangle.height(0);
  });

  stage.on('mousemove touchmove', () => {
    // do nothing if we didn't start selection
    if (!selectionRectangle.visible()) {
      return;
    }
    x2 = stage.getPointerPosition().x;
    y2 = stage.getPointerPosition().y;

    selectionRectangle.setAttrs({
      x: Math.min(x1, x2),
      y: Math.min(y1, y2),
      width: Math.abs(x2 - x1),
      height: Math.abs(y2 - y1),
    });
  });

  stage.on('dragmove', () => {
    calculateOffset(shape.attrs.x, shape.attrs.y, stage.attrs.width, stage.attrs.height);
  });

  stage.on('dragend', () => {
    updateJson();
  });

  stage.on('mouseup touchend', () => {
    var shapes = stage.find('.rect');
    var box = selectionRectangle.getClientRect();
    var selected = shapes.filter((shape) => Konva.Util.haveIntersection(box, shape.getClientRect()));
    // do nothing if we didn't start selection
    if (!selectionRectangle.visible()) {
      return;
    }
    // update visibility in timeout, so we can check it in click event
    setTimeout(() => {
      selectionRectangle.visible(false);
    });

    tr.nodes(selected);
  });

  // clicks should select/deselect shapes
  stage.on('click tap', (e) => {
    var nodes;

    // do we pressed shift or ctrl?
    var metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
    var isSelected = tr.nodes().indexOf(e.target) >= 0;

    // if we are selecting with rect, do nothing
    if (selectionRectangle.visible()) {
      return;
    }

    // if click on empty area - remove all selections
    if (e.target === stage) {
      tr.nodes([]);
      return;
    }

    // do nothing if clicked NOT on our rectangles
    if (!e.target.hasName('rect')) {
      return;
    }

    // if no key pressed and the node is not selected select just one
    if (!metaPressed && !isSelected) {
      tr.nodes([e.target]);
    } else if (metaPressed && isSelected) {
      nodes = tr.nodes().slice();
      nodes.splice(nodes.indexOf(e.target), 1);
      tr.nodes(nodes);
    } else if (metaPressed && !isSelected) {
      // add the node into selection
      nodes = tr.nodes().concat([e.target]);
      tr.nodes(nodes);
    }
  });
}

function initiateStage() {
  viewportDimensions.width = $('#viewport').width();
  viewportDimensions.height = setCanvasHeight($('#aspect-ratio').val());
  if (stage) stage.destroy();
  if (layer) layer.destroy();
  stage = new Konva.Stage({
    container: 'container',
    width: viewportDimensions.width,
    height: viewportDimensions.height,
  });
  layer = new Konva.Layer();
  stage.add(layer);
}

function resetStage() {
  var assetType = $('input[name="asset-type"]:checked').val();
  $('.config').addClass('hidden');
  if (shape) shape.destroy();
  codeMirror.setSize('100%', '100%');
  imageObj.src = $('#media-url').val();
  switch (assetType) {
    case 'html':
      htmlStage();
      $('#html-type').removeClass('hidden');
      break;
    case 'image':
      imageStage();
      $('#image-type').removeClass('hidden');
      break;
    default:
      break;
  }
  setSelectionRectangle();
  initiateEventHandlers();
  resetPosition();
}

// Download new image
$('#media-submit').on('click', () => {
  var url = $('#media-url').val();
  if (shape) shape.destroy();
  getImageMetadata(url, (data) => {
    shape.width(data.width);
    shape.height(data.height);
    edit.timeline.tracks[0].clips[0].scale = 1;
    dimensions = data;
    resetStage();
  });
});

// On position reset
$('#position-reset').on('click', () => {
  resetPosition();
});

// On viewport colour change
$('#viewport-background').on('change', () => {
  var viewportColor = $('#viewport-background').val();
  $('#container').css('background-color', viewportColor);
  edit.timeline.background = viewportColor;
  updateJson();
});

// On HTML background colour change
$('#html-background').on('change', () => {
  var htmlColor = $('#html-background').val();
  shape.fill(htmlColor);
  edit.timeline.tracks[0].clips[0].asset.background = htmlColor;
  updateJson();
});

// On aspect ratio change
$('#aspect-ratio').on('change', () => {
  edit.output.aspectRatio = $('#aspect-ratio').val();
  initiateStage();
  resetStage();
});

// On asset type change
$('input[name="asset-type"]').on('change', () => {
  resetStage();
});

// On resolution change
$('#resolution').on('change', () => {
  edit.output.resolution = $('#resolution').val();
  resetStage();
  updateJson();
});

// On position change
$('#position').on('change', () => {
  edit.timeline.tracks[0].clips[0].position = $('#position').val();
  resetPosition();
  calculateOffset(shape.attrs.x, shape.attrs.y, stage.attrs.width, stage.attrs.height);
  updateJson();
});

initiateStage();
resetStage();
