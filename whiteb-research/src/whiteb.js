$(document).ready(function (event) {
  "use strict";
  var pieChart = null;
  var isJoined = false;
  var newScreen = null;
  var isVideo = true;
  var submissionCount = 0;
  var handCount = 0;
  var userHandRaised = {};
  var remoteBrush = null;
  var path = null;

  var studentsList = {};
  var studentsQuizTime = {};
  var syncStatus = 1; // This means synching the screen data.
  var quizTimer = null;
  var answerOption = 0;
  var quizStartTime = 0;
  var eraserColor = "#ffffff";
  var eraserWidth = 4;
  var eraserArray = new Array();
  var pencilColor = "#000000";
  var pencilWidth = 2;
  var canvasInstances = [];
  var boardCount = 0;
  var isDrawing = 0;
  var gcanvas = new fabric.Canvas(`canvasBoard${boardCount}`, {
    isDrawingMode: false,
    backgroundColor: "#ffffff",
    selection: false,
    imageSmoothingEnabled: false,
    preserveObjectStacking: true,
  });
  canvasInstances[0] = gcanvas;
  var canvasWidth = $("#stage").width();
  var canvasHeight = $("#stage").height();
  var bgWidth, bgHeight;
  gcanvas.setDimensions({
    width: canvasWidth,
    height: canvasHeight,
  });
  gcanvas.calcOffset();
  const pencilCursorURL =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfkBRcHHinXk6JUAAAA3UlEQVQ4y8XQL04DYRCG8d9CahA0uB4BQnHoEu7ALZCotYDHErgK9Qg4ANjyJ9mEpIYaEgZRINtNp7soPjl5nvneeWl7O+5NnSlaSbDtRQjhytpf8BCu25WyhodwqVhP4aEjF3pGtdm+Xh7mVShxvvDHNNteCR/CSUO5y/EHhz4bSmU3C/PowNM3VuJUqOx1wX+U0jAPMzJpFHqcN9PcHu1hJv+Pz099XnJqlTcz8+6tC04ljA3cdsMJoY/+gpLic2FgS1FTVuB+d25iYNaG14UNN1mRy4QVvedCB/wLBVjYV4JLo+sAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjAtMDUtMjNUMDc6MzA6NDErMDA6MDAJTqpqAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIwLTA1LTIzVDA3OjMwOjQxKzAwOjAweBMS1gAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII=";
  gcanvas.freeDrawingCursor = "url(" + pencilCursorURL + ") 0 30, auto";
  const eraserCursorURL =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABGklEQVR4AZ1WAaqFMAzbZbyH7xzeynddSR8BJzH+7rsWSuzWNaQVZzuOI2hEOgCGRMb6TNRcf/5zr+mG48xeZqJgWAQUYtjNc9XvBOtnjWVZ3EF8u84aStZCjAnbtsX+3dUhCIs1j2dZQ+f5JGCiGQwjiXmWNfIZ/EcgnhO4gh68UBCzCnwGTuDF3GOqRUpQs7xFOBcgBGnfR2snwRWzZtNEbjpB2nfLUYKbAgCqgEkoENDDFdDZIlUQswSKNgM6TEF5BjGaQektqr6mOgPE2OCxElxfUwA96AQhViLwC8cVRNr3ZF0IOEclfiqQzzVmkWeVwGfAywJMEI8MszzWuLXIrzi/But3ts/ALS8ytdde/n6kvzD+q+PnfssK95g07Vc5AAAAAElFTkSuQmCC";
  // current unsaved state
  var currentState = gcanvas.toJSON([
    "uuid",
    "tool",
    "hasControls",
    "hasBorders",
    "selectable",
    "hoverCursor",
  ]);
  // past states
  var undoStack = [];
  // reverted states
  var redoStack = [];

  var stackProcessing = false;
  var isModerator = true;
  const MODERATOR_USER_ID = 100;
  const USER_HAND_EVENT = 9;
  const DATA_SYNC_EVENT = 10;
  const VIDEO_MODE_EVENT = 10.5;
  const VIDEO_RESUME_EVENT = 10.6;
  const DRAWING_MODE_EVENT = 11;
  const EDITOR_MODE_EVENT = 12;
  const SCREEN_SHARE_EVENT = 13;
  const SHOW_RESULT_EVENT = 14;
  const MUTE_ALL_VIDEO = 15;
  const MUTE_ALL_AUDIO = 16;
  const PREP_QUIZ_EVENT = 17;
  const START_QUIZ_EVENT = 18;
  const QUIT_QUIZ_EVENT = 19;
  const STUDENT_ANSWER_EVENT = 20;
  const END_CLASS_EVENT = 21;
  const TUTORIX_VIDEO_PLAY = 31;
  const TUTORIX_VIDEO_PAUSE = 32;
  const TUTORIX_VIDEO_PLAYING = 33;
  const TUTORIX_VIDEO_RATECHANGE = 34;
  const TUTORIX_VIDEO_ENDED = 35;
  const SYNC_TAB_INDEX = 36;
  const MOUSE_CURSOR_SYNC = 37;
  const MOUSE_DOWN_EVENT = 40;
  const MOUSE_MOVE_EVENT = 41;
  const MOUSE_UP_EVENT = 42;
  const OBJECT_SELECTED_EVENT = 43;
  const PARTICIPANT_STATS_EVENT = 44;

  const CANVAS_RESIZE_EVENT = 100;
  const SET_BACKGROUND_COLOR = 101;
  const SET_BACKGROUND_PATTERN = 102;
  const SET_BACKGROUND_IMAGE = 103;
  const SET_PENCIL_EVENT = 104;
  const SET_ERASER_EVENT = 105;
  const JOIN_TIME_SYNC_EVENT = 106;
  const STAGE_SCROLL_EVENT = 107;
  const EDITOR_SCROLL_EVENT = 108;
  const ADD_IMAGE_EVENT = 109;
  const CANVAS_SYNC_EVENT = 110;
  const FILL_COLOR_EVENT = 111;
  const ADD_TEXT_EVENT = 112;
  const MODIFY_TEXT_EVENT = 113;
  const MODIFY_TEXT_FAMILY = 114;
  const MODIFY_TEXT_ALIGN = 115;
  const MODIFY_TEXT_STYLE = 116;
  const MODIFY_TEXT_SIZE = 117;
  const MODIFY_TEXT_FILL = 118;
  const MODIFY_TEXT_BACKGROUND = 119;
  const MODIFY_TEXT_STROKE = 120;
  const REMOVE_OBJECT_EVENT = 121;

  const DRAWING_PENCIL_TOOL = 50;
  const DRAWING_SELECT_TOOL = 51;
  const DRAWING_ERASER_TOOL = 52;
  const DRAWING_LINE_TOOL = 53;
  const DRAWING_TRIANGLE_TOOL = 54;
  const DRAWING_RECT_TOOL = 55;
  const DRAWING_SQUARE_TOOL = 56;
  const DRAWING_CIRCLE_TOOL = 57;
  const DRAWING_ELLIPSE_TOOL = 58;
  const DRAWING_ARROW_TOOL = 59;
  const DRAWING_IMAGE_TOOL = 60;
  const DRAWING_TEXT_TOOL = 61;

  var isDataChannelOpen = false;
  var currentMode = DRAWING_MODE_EVENT;
  var drawingTool = DRAWING_PENCIL_TOOL;
  var lastObject;

  $("#wrapLoader").show();
  $("#wait").html("Platform setup in progress...");
  $("#cc").hide();
  //$('.db-nav').hide();

  $("#easyui-pages").pagination({
    total: 1,
    showPageList: false,
    showRefresh: false,
    displayMsg: "",
    beforePageText: "Board ",
    onSelectPage: function (index, pageSize) {
      console.log("Going to canvas index - " + index);
      changeCanvas(index);
    },
  });
  $("#easyui-pages").pagination("select", 1);
  $("#ancAddBoard").click(function () {
    boardCount = boardCount + 1;
    let board = `<div id="canvasBoardDiv${boardCount}" class="canvasClass" title="Board${boardCount}" style="width:100% !important;height:100% !important;"><canvas style="width:100% !important;height:100% !important;" id="canvasBoard${boardCount}"></canvas></div>`;
    $("#canvasContainer").append(board);
    gcanvas = new fabric.Canvas(`canvasBoard${boardCount}`, {
      isDrawingMode: true,
      backgroundColor: "#ffffff",
      width: $("#center").width(),
      height: $("#center").height(),
      selection: false,
      imageSmoothingEnabled: false,
    });
    $(".canvasClass").hide();
    $(`#canvasBoardDiv${boardCount}`).show();
    canvasInstances[boardCount - 1] = gcanvas;
    gcanvas.freeDrawingBrush.color = pencilColor;
    gcanvas.freeDrawingBrush.width = pencilWidth;
    gcanvas.freeDrawingCursor = "url(" + pencilCursorURL + ") 0 30, auto";
    gcanvas.renderAll();
    $("#easyui-pages").pagination("refresh", {
      total: boardCount,
      pageSize: 1,
    });
    $("#easyui-pages").pagination("select", boardCount);
    $("#easyui-pages").show();
  });

  fabric.Object.prototype.transparentCorners = false;
  gcanvas.setHeight($("#center").height());
  gcanvas.setWidth($("#center").width());
  gcanvas.freeDrawingBrush.color = pencilColor;
  gcanvas.freeDrawingBrush.width = pencilWidth;

  function saveCurrentState() {
    if (stackProcessing) {
      return;
    }
    redoStack = [];
    if (currentState) {
      undoStack.push(currentState);
    }
    currentState = gcanvas.toJSON([
      "uuid",
      "tool",
      "hasControls",
      "hasBorders",
      "selectable",
      "hoverCursor",
    ]);
  }

  function changeCanvas(index) {
    $(".canvasClass").hide();
    $("#cc").layout("resize");
    $(`#canvasBoardDiv${index}`).show();
    $(".subProperties").hide();
    gcanvas = canvasInstances[index - 1];
    drawingTool = DRAWING_PENCIL_TOOL;
    isDrawing = 0;
    gcanvas.isDrawingMode = true;
    gcanvas.freeDrawingBrush.color = pencilColor;
    gcanvas.freeDrawingBrush.width = pencilWidth;
    gcanvas.freeDrawingCursor = "url(" + pencilCursorURL + ") 0 30, auto";

    gcanvas.__eventListeners = {};
    gcanvas.off("object:moving");
    gcanvas.off("mouse:down");
    gcanvas.off("mouse:move");
    gcanvas.off("object:selected");
    gcanvas.off("mouse:up");
    gcanvas.off("object:removed");

    console.log("Going to change canvas to " + index);
    console.log(gcanvas);
    currentState = gcanvas.toJSON([
      "uuid",
      "tool",
      "hasControls",
      "hasBorders",
      "selectable",
      "hoverCursor",
    ]);
    console.log(currentState);
    // past states
    undoStack = [];
    // reverted states
    redoStack = [];
    gcanvas.on("object:removed", function (obj) {});
    gcanvas.on("mouse:down", function (e) {
      var data = null;
      if (
        e.target &&
        e.target.uuid &&
        (drawingTool == DRAWING_SELECT_TOOL ||
          drawingTool == DRAWING_IMAGE_TOOL ||
          drawingTool == DRAWING_TEXT_TOOL)
      ) {
        isDrawing = 1;
        data = {
          drawingTool: drawingTool,
          uuid: e.target.uuid,
          tool: e.target.tool,
        };
        //                gcanvas.bringToFront(e.target);
        console.log("Object selected....");
        console.log(e);
        return;
      }
      console.log("Mouse Down....");
      console.log(e);
      var obj_id = uuid();
      var pointer = this.getPointer(e.e);
      data = {
        pointer: pointer,
        drawingTool: drawingTool,
        uuid: obj_id,
      };
      if (
        drawingTool == DRAWING_SELECT_TOOL ||
        drawingTool == DRAWING_IMAGE_TOOL ||
        drawingTool == DRAWING_TEXT_TOOL
      ) {
        isDrawing = 1;
      } else if (drawingTool == DRAWING_LINE_TOOL) {
        isDrawing = 1;
        DrawLineMouseDown(pointer, obj_id);
      } else if (drawingTool == DRAWING_ARROW_TOOL) {
        isDrawing = 1;
        DrawArrowMouseDown(pointer, obj_id);
      } else if (drawingTool == DRAWING_TRIANGLE_TOOL) {
        isDrawing = 1;
        DrawTriangleMouseDown(pointer, obj_id);
      } else if (drawingTool == DRAWING_RECT_TOOL) {
        isDrawing = 1;
        DrawRectMouseDown(pointer, obj_id);
      } else if (drawingTool == DRAWING_SQUARE_TOOL) {
        isDrawing = 1;
        DrawSquareMouseDown(pointer, obj_id);
      } else if (drawingTool == DRAWING_CIRCLE_TOOL) {
        isDrawing = 1;
        DrawCircleMouseDown(pointer, obj_id);
      } else if (drawingTool == DRAWING_ELLIPSE_TOOL) {
        isDrawing = 1;
        DrawEllipseMouseDown(pointer, obj_id);
      }
    });
    gcanvas.on("mouse:move", function (e) {
      var pointer = this.getPointer(e.e);
      var data = null;
      if (
        isDrawing &&
        e.target &&
        e.target.tool &&
        (drawingTool == DRAWING_SELECT_TOOL ||
          drawingTool == DRAWING_IMAGE_TOOL ||
          drawingTool == DRAWING_TEXT_TOOL)
      ) {
        data = {
          pointer: pointer,
          drawingTool: drawingTool,
          uuid: e.target.uuid,
          angle: e.target.angle,
          zoomX: e.target.zoomX,
          zoomY: e.target.zoomY,
          scaleX: e.target.scaleX,
          scaleY: e.target.scaleY,
          left: e.target.left,
          top: e.target.top,
          width: e.target.width,
          height: e.target.height,
          x1: e.target.x1,
          x2: e.target.x2,
          y1: e.target.y1,
          y2: e.target.y2,
          rx: e.target.rx,
          ry: e.target.rx,
          originX: e.target.originX,
          originY: e.target.originY,
          tool: e.target.tool,
        };
        return;
      }
      data = {
        pointer: pointer,
        drawingTool: drawingTool,
      };
      if (drawingTool == DRAWING_LINE_TOOL) {
        DrawLineMouseMove(pointer);
      } else if (drawingTool == DRAWING_ARROW_TOOL) {
        DrawArrowMouseMove(pointer);
      } else if (drawingTool == DRAWING_TRIANGLE_TOOL) {
        DrawTriangleMouseMove(pointer);
      } else if (drawingTool == DRAWING_RECT_TOOL) {
        DrawRectMouseMove(pointer);
      } else if (drawingTool == DRAWING_SQUARE_TOOL) {
        DrawSquareMouseMove(pointer);
      } else if (drawingTool == DRAWING_CIRCLE_TOOL) {
        DrawCircleMouseMove(pointer);
      } else if (drawingTool == DRAWING_ELLIPSE_TOOL) {
        DrawEllipseMouseMove(pointer);
      }
    });
    gcanvas.on("mouse:up", function (e) {
      var pointer = this.getPointer(e.e);
      console.log("mouse:up");
      var obj_id = uuid();
      var data = {
        pointer: pointer,
        drawingTool: drawingTool,
        uuid: obj_id,
      };
      if (
        drawingTool == DRAWING_SELECT_TOOL ||
        drawingTool == DRAWING_IMAGE_TOOL ||
        drawingTool == DRAWING_TEXT_TOOL
      ) {
        DrawSelectMouseUp(pointer);
      } else if (drawingTool == DRAWING_LINE_TOOL) {
        DrawLineMouseUp(pointer);
      } else if (drawingTool == DRAWING_ARROW_TOOL) {
        DrawArrowMouseUp(pointer, obj_id);
      } else if (drawingTool == DRAWING_TRIANGLE_TOOL) {
        DrawTriangleMouseUp(pointer);
      } else if (drawingTool == DRAWING_RECT_TOOL) {
        DrawRectMouseUp(pointer);
      } else if (drawingTool == DRAWING_SQUARE_TOOL) {
        DrawSquareMouseUp(pointer);
      } else if (drawingTool == DRAWING_CIRCLE_TOOL) {
        DrawCircleMouseUp(pointer);
      } else if (drawingTool == DRAWING_ELLIPSE_TOOL) {
        DrawEllipseMouseUp(pointer);
      }
      saveCurrentState();
      if (
        drawingTool == DRAWING_ERASER_TOOL ||
        drawingTool == DRAWING_PENCIL_TOOL ||
        drawingTool == DRAWING_SELECT_TOOL
      ) {
        return;
      }
      enableObjects();
      gcanvas.setActiveObject(lastObject);
      gcanvas.renderAll();
      drawingTool = DRAWING_SELECT_TOOL;
    });
  }

  $("#cc")
    .layout("panel", "east")
    .panel({
      onExpand: function () {
        gcanvas.setWidth($("#center").width() - 220);
        gcanvas.renderAll();
        $("#cc").layout("resize");
      },
      onCollapse: function () {
        gcanvas.setWidth($("#center").width());
        gcanvas.renderAll();
        $("#cc").layout("resize");
      },
    });

  /* Background Color */
  $("#ancColor").click(function () {
    disableObjects();
    if ($("#penColorPick").is(":visible")) {
      $("#penColorPick").hide();
    } else {
      $(".subProperties").hide();
      $("#penColorPick").show();
    }
  });
  $(".clsBgColor").click(function () {
    console.log("Setting background color...");
    let bgclr = $(this).children().css("background-color");
    bgclr = rgb2hex(bgclr);
    gcanvas.backgroundImage = 0;
    gcanvas.setBackgroundColor("");
    gcanvas.setBackgroundColor(bgclr);
    if (bgclr === "#ffffff") {
      $("#ancPattern img").css("border-color", "#cccccc");
    } else {
      $("#ancPattern img").css("border-color", bgclr);
    }
    gcanvas.renderAll();
    saveCurrentState();
  });
  $("#txtBgColorVal").on("propertychange input", function (e) {
    var bgclr = $(this).val();
    gcanvas.backgroundImage = 0;
    gcanvas.setBackgroundColor("");
    gcanvas.setBackgroundColor(bgclr);
    if (bgclr === "#ffffff") {
      $("#ancPattern img").css("border-color", "#cccccc");
    } else {
      $("#ancPattern img").css("border-color", bgclr);
    }
    gcanvas.renderAll();
    saveCurrentState();
  });

  $("#txtBgColorVal").change(function () {
    var bgclr = $(this).val();
    gcanvas.backgroundImage = 0;
    gcanvas.setBackgroundColor("");
    gcanvas.setBackgroundColor(bgclr);
    if (bgclr === "#ffffff") {
      $("#ancPattern img").css("border-color", "#cccccc");
    } else {
      $("#ancPattern img").css("border-color", bgclr);
    }
    gcanvas.renderAll();
    saveCurrentState();
  });

  $(".bgclpkr").click(function () {
    var src = $(this).children().attr("src");
    console.log(src);
    gcanvas.setBackgroundImage("");
    gcanvas.backgroundImage = 0;
    gcanvas.setBackgroundColor("#ffffff");
    gcanvas.setBackgroundColor(
      {
        source: src,
        repeat: "repeat",
      },
      function () {
        gcanvas.renderAll();
        saveCurrentState();
      }
    );
  });
  $("#btnUploadPattern").click(function () {
    $("#filePattern").click();
  });
  $("#filePattern").change(function (e) {
    console.log("Setting uploaded image");
    var file = $("#filePattern").val();
    var exts = ["jpg", "jpeg", "png"];
    if (file.length <= 0) {
      $.messager.alert({
        title: "Alert",
        msg: "You did not select any file to upload",
        width: 350,
      });
      $("#filePattern").focus();
      return false;
    }
    var ext = file.split(".");
    ext = ext.reverse();
    if ($.inArray(ext[0].toLowerCase(), exts) < 0) {
      $.messager.alert({
        title: "Alert",
        msg: "Supported files are JPG, JPEG and PNG",
        width: 350,
      });
      $("#filePattern").focus();
      return false;
    }
    var formdata = new FormData();
    formdata.append("file", $("#filePattern")[0].files[0]);
    $("#wrapLoader").show();
    $("#wait").html("Uploading Background Image...");
    $.ajax({
      url: "#/image_upload.php",
      dataType: "json",
      method: "POST",
      cache: false,
      data: formdata,
      processData: false,
      contentType: false,
      success: function (data) {
        setCanvasBackgroundImg(gcanvas, data.imgurl);
        gcanvas.renderAll();
        $("#fileImage").val("");
        $("#filePattern").val("");
        $(".subProperties").hide();
      },
    });
  });
  /* Pencil */
  $("#ancPencil").click(function () {
    disableObjects();
    drawingTool = DRAWING_PENCIL_TOOL;
    gcanvas.isDrawingMode = true;
    gcanvas.freeDrawingBrush.color = pencilColor;
    gcanvas.freeDrawingBrush.width = pencilWidth;
    gcanvas.freeDrawingCursor = "url(" + pencilCursorURL + ") 0 30, auto";
    $(".subProperties").hide();
  });
  $(".clsPencilColor").click(function () {
    let pclr = $(this).children().css("background-color");
    pclr = rgb2hex(pclr);
    $("#txtPencilClrVal").val(pclr);
    $("#txtPencilClrHexa").val(pclr);
    gcanvas.freeDrawingBrush.color = pclr;
    pencilColor = pclr;
    //        $("#ancColor").css("color", pclr);
    gcanvas.renderAll();
  });

  function rgb2hex(rgb) {
    rgb = rgb.match(
      /^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i
    );
    return rgb && rgb.length === 4
      ? "#" +
          ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
          ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
          ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2)
      : "";
  }
  $("#lineSlide").numberspinner({
    min: 1,
    max: 50,
    increment: 1,
    editable: true,
    value: 2,
    onChange: function (nv) {
      gcanvas.freeDrawingBrush.color = $("#txtPencilClrVal").val();
      gcanvas.freeDrawingBrush.width = parseInt(nv);
      pencilWidth = parseInt(nv);
      gcanvas.renderAll();
    },
  });
  $("#txtPencilClrVal").change(function () {
    $("#txtPencilClrHexa").val($(this).val());
    gcanvas.freeDrawingBrush.color = $(this).val();
    //        $("#ancColor").css("color", $(this).val());
    pencilColor = $(this).val();
    gcanvas.renderAll();
  });
  $("#txtPencilClrHexa").keyup(function () {
    $("#txtPencilClrVal").val($(this).val());
    gcanvas.freeDrawingBrush.color = $(this).val();
    //        $("#ancColor").css("color", $(this).val());
    pencilColor = $(this).val();
    gcanvas.renderAll();
  });

  /* Eraser */
  $("#ancEraser").click(function () {
    disableObjects();
    drawingTool = DRAWING_ERASER_TOOL;
    gcanvas.freeDrawingCursor = "url(" + eraserCursorURL + ") 10 10, auto";
    if (typeof gcanvas.backgroundColor == "object") {
      eraserColor = "#ffffff";
    } else {
      eraserColor = gcanvas.backgroundColor;
    }
    eraserWidth = 2 * $("#eraserSlide").val();
    eraserArray.push(eraserColor);
    gcanvas.freeDrawingBrush.color = eraserColor;
    gcanvas.freeDrawingBrush.width = eraserWidth;
    gcanvas.isDrawingMode = true;

    if ($("#eraseOptions").is(":visible")) {
      $("#eraseOptions").hide();
    } else {
      $(".subProperties").hide();
      $("#eraseOptions").show();
    }
  });
  $("#eraserSlide").numberspinner({
    min: 1,
    max: 50,
    increment: 1,
    editable: true,
    value: 15,
    onChange: function (nv) {
      eraserColor = gcanvas.backgroundColor;
      eraserWidth = parseInt(nv);
      gcanvas.freeDrawingBrush.color = eraserColor;
      gcanvas.freeDrawingBrush.width = eraserWidth;
      gcanvas.renderAll();
    },
  });

  /* select */
  $("#ancSelect").click(function () {
    enableObjects();
  });
  function enableObjects() {
    drawingTool = DRAWING_SELECT_TOOL;
    gcanvas.isDrawingMode = false;
    gcanvas.forEachObject(function (obj) {
      console.log(obj);
      if (obj.get("type") === "path") {
        obj.set({
          hoverCursor: "default",
          hasControls: false,
          hasBorders: false,
          selectable: false,
        });
      } else {
        obj.set({
          hoverCursor: "move",
          hasControls: true,
          hasBorders: true,
          selectable: true,
        });
        gcanvas.setActiveObject(obj);
        gcanvas.renderAll();
      }
    });
    $(".subProperties").hide();
    gcanvas.discardActiveObject();
    gcanvas.renderAll();
  }
  function disableObjects() {
    gcanvas.forEachObject(function (obj) {
      console.log(obj);
      obj.set({
        hoverCursor: "default",
        hasControls: false,
        hasBorders: false,
        selectable: false,
      });
      gcanvas.discardActiveObject();
      gcanvas.renderAll();
    });
  }

  function setDrawingTool(tool) {
    disableObjects();
    drawingTool = tool;
  }

  function DrawSelectMouseUp(pointer) {
    isDrawing = 0;
  }
  $("#ancShape").click(function () {
    disableObjects();
    gcanvas.isDrawingMode = false;
    if ($("#shapeOptions").is(":visible")) {
      $("#shapeOptions").hide();
    } else {
      $(".subProperties").hide();
      $("#shapeOptions").show();
    }
  });
  var fillColor = "#ffffff";
  $("#txtFillClrVal").val(fillColor);

  $("#shapeRect").click(function () {
    setDrawingTool(DRAWING_RECT_TOOL);
  });

  function uuid() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }
  var rectShape, origX, origY;
  //  Draw Rectangle events on mouse event
  function DrawRectMouseDown(pointer, uuid) {
    origX = pointer.x;
    origY = pointer.y;
    rectShape = new fabric.Rect({
      strokeUniform: true,
      hoverCursor: "default",
      hasControls: false,
      hasBorders: false,
      selectable: false,
      left: origX,
      top: origY,
      stroke: pencilColor,
      strokeWidth: pencilWidth,
      originX: "left",
      originY: "top",
      width: pointer.x - origX,
      height: pointer.y - origY,
      fill: fillColor,
      transparentCorners: false,
      uuid: uuid,
      tool: DRAWING_RECT_TOOL,
    });
    lastObject = rectShape;
    gcanvas.add(rectShape);
  }

  function DrawRectMouseMove(pointer) {
    if (!isDrawing) {
      return false;
    }
    if (origX > pointer.x) {
      rectShape.set({
        left: Math.abs(pointer.x),
      });
    }
    if (origY > pointer.y) {
      rectShape.set({
        top: Math.abs(pointer.y),
      });
    }
    rectShape.set({
      width: Math.abs(origX - pointer.x),
    });
    rectShape.set({
      height: Math.abs(origY - pointer.y),
    });
    gcanvas.renderAll();
  }

  function DrawRectMouseUp(pointer) {
    isDrawing = 0;
  }
  $("#shapeSquare").click(function () {
    setDrawingTool(DRAWING_SQUARE_TOOL);
  });
  var squareShape;
  //  Draw Rectangle events on mouse event
  function DrawSquareMouseDown(pointer, uuid) {
    console.log("DrawSquareMouseDown");
    origX = pointer.x;
    origY = pointer.y;
    squareShape = new fabric.Rect({
      hoverCursor: "default",
      hasControls: false,
      hasBorders: false,
      selectable: false,
      left: origX,
      top: origY,
      stroke: pencilColor,
      strokeWidth: pencilWidth,
      originX: "left",
      originY: "top",
      width: pointer.x - origX,
      height: pointer.x - origX,
      fill: fillColor,
      transparentCorners: false,
      uuid: uuid,
      tool: DRAWING_SQUARE_TOOL,
    });
    lastObject = squareShape;
    gcanvas.add(squareShape);
  }

  function DrawSquareMouseMove(pointer) {
    if (!isDrawing) {
      return false;
    }
    if (origX > pointer.x) {
      squareShape.set({
        left: Math.abs(pointer.x),
      });
    }
    if (origY > pointer.y) {
      squareShape.set({
        top: Math.abs(pointer.y),
      });
    }
    squareShape.set({
      width: Math.abs(origX - pointer.x),
    });
    squareShape.set({
      height: Math.abs(origX - pointer.x),
    });
    gcanvas.renderAll();
  }

  function DrawSquareMouseUp(pointer) {
    isDrawing = 0;
  }
  $("#shapeCircle").click(function () {
    setDrawingTool(DRAWING_CIRCLE_TOOL);
  });
  var circleShape;
  //  Draw Rectangle events on mouse event
  function DrawCircleMouseDown(pointer, uuid) {
    console.log("DrawCircleMouseDown");
    origX = pointer.x;
    origY = pointer.y;
    circleShape = new fabric.Circle({
      hoverCursor: "default",
      hasControls: false,
      hasBorders: false,
      selectable: false,
      left: origX,
      top: origY,
      originX: "left",
      originY: "top",
      angle: 0,
      stroke: pencilColor,
      strokeWidth: pencilWidth,
      radius: pointer.x - origX,
      fill: fillColor,
      transparentCorners: false,
      uuid: uuid,
      tool: DRAWING_CIRCLE_TOOL,
    });
    lastObject = circleShape;
    gcanvas.add(circleShape);
  }

  function DrawCircleMouseMove(pointer) {
    if (!isDrawing) {
      return false;
    }
    var radius =
      Math.max(Math.abs(origY - pointer.y), Math.abs(origX - pointer.x)) / 2;
    if (radius > circleShape.strokeWidth) {
      radius -= circleShape.strokeWidth / 2;
    }
    circleShape.set({
      radius: radius,
    });
    if (origX > pointer.x) {
      circleShape.set({
        originX: "right",
      });
    } else {
      circleShape.set({
        originX: "left",
      });
    }
    if (origY > pointer.y) {
      circleShape.set({
        originY: "bottom",
      });
    } else {
      circleShape.set({
        originY: "top",
      });
    }
    gcanvas.renderAll();
  }

  function DrawCircleMouseUp(pointer) {
    isDrawing = 0;
  }
  $("#shapeTriangle").click(function () {
    setDrawingTool(DRAWING_TRIANGLE_TOOL);
  });

  var triangleShape = 0;
  function DrawTriangleMouseDown(pointer, uuid) {
    origX = pointer.x;
    origY = pointer.y;
    triangleShape = new fabric.Triangle({
      hoverCursor: "default",
      hasControls: false,
      hasBorders: false,
      selectable: false,
      left: origX,
      top: origY,
      stroke: pencilColor,
      strokeWidth: pencilWidth,
      originX: "left",
      originY: "top",
      width: pointer.x - origX,
      height: pointer.y - origY,
      fill: fillColor,
      transparentCorners: false,
      uuid: uuid,
      tool: DRAWING_TRIANGLE_TOOL,
    });
    lastObject = triangleShape;
    gcanvas.add(triangleShape);
    gcanvas.renderAll();
  }

  function DrawTriangleMouseMove(pointer) {
    if (!isDrawing) {
      return false;
    }
    if (origX > pointer.x) {
      triangleShape.set({
        left: Math.abs(pointer.x),
      });
    }
    if (origY > pointer.y) {
      triangleShape.set({
        top: Math.abs(pointer.y),
      });
    }
    triangleShape.set({
      width: Math.abs(origX - pointer.x),
    });
    triangleShape.set({
      height: Math.abs(origY - pointer.y),
    });
    gcanvas.renderAll();
  }

  function DrawTriangleMouseUp(pointer) {
    isDrawing = 0;
  }
  $("#shapeLine").click(function () {
    setDrawingTool(DRAWING_LINE_TOOL);
  });

  var lineShape = 0;
  //  Draw Line events on mouse event
  function DrawLineMouseDown(pointer, uuid) {
    var points = [pointer.x, pointer.y, pointer.x, pointer.y];
    lineShape = new fabric.Line(points, {
      hoverCursor: "default",
      hasControls: false,
      hasBorders: false,
      selectable: false,
      fill: pencilColor,
      stroke: pencilColor,
      strokeWidth: pencilWidth,
      originX: "center",
      originY: "center",
      transparentCorners: false,
      uuid: uuid,
      tool: DRAWING_LINE_TOOL,
    });
    lastObject = lineShape;
    gcanvas.add(lineShape);
    gcanvas.renderAll();
  }

  function DrawLineMouseMove(pointer) {
    if (!isDrawing) {
      return false;
    }
    lineShape.set({
      x2: pointer.x,
      y2: pointer.y,
    });
    gcanvas.renderAll();
  }

  function DrawLineMouseUp(pointer) {
    isDrawing = 0;
  }

  $("#shapeArrow").click(function () {
    setDrawingTool(DRAWING_ARROW_TOOL);
  });
  var arrowLine, arrowHead, deltaX, deltaY;
  var FabricCalcArrowAngle = function (x1, y1, x2, y2) {
    var angle = 0,
      x,
      y;
    x = x2 - x1;
    y = y2 - y1;
    if (x === 0) {
      angle = y === 0 ? 0 : y > 0 ? Math.PI / 2 : (Math.PI * 3) / 2;
    } else if (y === 0) {
      angle = x > 0 ? 0 : Math.PI;
    } else {
      angle =
        x < 0
          ? Math.atan(y / x) + Math.PI
          : y < 0
          ? Math.atan(y / x) + 2 * Math.PI
          : Math.atan(y / x);
    }
    return (angle * 180) / Math.PI + 90;
  };
  //  Draw Line events on mouse event
  function DrawArrowMouseDown(pointer, uuid) {
    var points = [pointer.x, pointer.y, pointer.x, pointer.y];
    arrowLine = new fabric.Line(points, {
      hoverCursor: "default",
      hasControls: false,
      hasBorders: false,
      selectable: false,
      fill: pencilColor,
      stroke: pencilColor,
      strokeWidth: pencilWidth,
      originX: "center",
      originY: "center",
      transparentCorners: false,
      uuid: uuid,
      tool: DRAWING_ARROW_TOOL,
    });
    var centerX = (arrowLine.x1 + arrowLine.x2) / 2;
    var centerY = (arrowLine.y1 + arrowLine.y2) / 2;
    deltaX = arrowLine.left - centerX;
    deltaY = arrowLine.top - centerY;
    arrowHead = new fabric.Triangle({
      left: arrowLine.get("x1") + deltaX,
      top: arrowLine.get("y1") + deltaY,
      originX: "center",
      originY: "center",
      hoverCursor: "default",
      hasControls: false,
      hasBorders: false,
      selectable: false,
      angle: -45,
      width: 10,
      height: 10,
      fill: pencilColor,
      stroke: pencilColor,
      uuid: uuid + "head",
      strokeWidth: pencilWidth,
    });
    gcanvas.add(arrowLine, arrowHead);
  }

  function DrawArrowMouseMove(pointer) {
    if (!isDrawing) {
      return false;
    }
    arrowLine.set({
      x2: pointer.x,
      y2: pointer.y,
    });
    arrowHead.set({
      left: pointer.x + deltaX,
      top: pointer.y + deltaY,
      angle: FabricCalcArrowAngle(
        arrowLine.x1,
        arrowLine.y1,
        arrowLine.x2,
        arrowLine.y2
      ),
    });
    gcanvas.renderAll();
  }

  function DrawArrowMouseUp(pointer, uuid) {
    isDrawing = 0;
    var group = new window.fabric.Group([arrowLine, arrowHead], {
      hoverCursor: "default",
      hasControls: false,
      hasBorders: false,
      selectable: false,
      lockScalingFlip: true,
      typeOfGroup: "arrow",
      userLevel: 1,
      uuid: uuid,
      tool: DRAWING_ARROW_TOOL,
    });
    gcanvas.remove(arrowLine, arrowHead);
    lastObject = group;
    gcanvas.add(group);
    gcanvas.renderAll();
  }

  $("#shapeEllipse").click(function () {
    setDrawingTool(DRAWING_ELLIPSE_TOOL);
  });
  var ellipseShape;
  //  Draw Rectangle events on mouse event
  function DrawEllipseMouseDown(pointer, uuid) {
    origX = pointer.x;
    origY = pointer.y;
    ellipseShape = new fabric.Ellipse({
      hoverCursor: "default",
      hasControls: false,
      hasBorders: false,
      selectable: false,
      left: origX,
      top: origY,
      originX: "left",
      originY: "top",
      angle: 0,
      stroke: pencilColor,
      strokeWidth: pencilWidth,
      rx: pointer.x - origX,
      ry: pointer.y - origY,
      fill: fillColor,
      transparentCorners: false,
      uuid: uuid,
      tool: DRAWING_ELLIPSE_TOOL,
    });
    lastObject = ellipseShape;
    gcanvas.add(ellipseShape);
  }

  function DrawEllipseMouseMove(pointer) {
    if (!isDrawing) {
      return false;
    }
    var rx = Math.abs(origX - pointer.x) / 2;
    var ry = Math.abs(origY - pointer.y) / 2;
    if (rx > ellipseShape.strokeWidth) {
      rx -= ellipseShape.strokeWidth / 2;
    }
    if (ry > ellipseShape.strokeWidth) {
      ry -= ellipseShape.strokeWidth / 2;
    }
    ellipseShape.set({
      rx: rx,
      ry: ry,
    });

    if (origX > pointer.x) {
      ellipseShape.set({
        originX: "right",
      });
    } else {
      ellipseShape.set({
        originX: "left",
      });
    }
    if (origY > pointer.y) {
      ellipseShape.set({
        originY: "bottom",
      });
    } else {
      ellipseShape.set({
        originY: "top",
      });
    }
    gcanvas.renderAll();
  }

  function DrawEllipseMouseUp(pointer) {
    isDrawing = 0;
  }
  $("#txtFillClrHexa").keyup(function () {
    fillColor = $(this).val();
  });
  $("#txtFillClrVal").on("propertychange input", function (e) {
    fillColor = $(this).val();
  });
  $("#txtFillClrVal").change(function () {
    fillColor = $(this).val();
    console.log("Fill Color 2" + fillColor);
  });
  $("#txtShapeOutline").keyup(function () {
    var cobj = gcanvas.getActiveObject();
    if (cobj) {
      cobj.set({
        strokeWidth: parseInt($(this).val()),
      });
      gcanvas.renderAll();
    }
  });
  $("#txtShapeOutlineHexavalue").keyup(function () {
    $("#txtShapeOutlineClrVal").val($(this).val());
    var cobj = gcanvas.getActiveObject();
    if (cobj) {
      cobj.setStroke($(this).val());
      gcanvas.renderAll();
    }
  });
  $("#txtShapeOutlineClrVal").change(function () {
    $("#txtShapeOutlineHexavalue").val($(this).val());
    var cobj = gcanvas.getActiveObject();
    if (cobj) {
      cobj.setStroke($(this).val());
      gcanvas.renderAll();
    }
  });

  $(".clrDynamicCanvas").click(function () {
    $(".subProperties").hide();
    if (gcanvas.getObjects().length > 0) {
      $.messager.confirm(
        "Confirmation",
        `Do you really want to clear the board?`,
        function (r) {
          if (r) {
            gcanvas.clear();
            gcanvas.setBackgroundImage("");
            gcanvas.backgroundImage = 0;
            gcanvas.setBackgroundColor("#ffffff");
            gcanvas.freeDrawingBrush.width = pencilWidth;
            gcanvas.freeDrawingBrush.color = pencilColor;
            gcanvas.renderAll();
            $("#lineSlide").numberspinner({
              value: 2,
            });
            $("#eraserSlide").numberspinner({
              value: 15,
            });
            disableObjects();
            drawingTool = DRAWING_PENCIL_TOOL;
            gcanvas.isDrawingMode = true;
            gcanvas.freeDrawingBrush.color = pencilColor;
            gcanvas.freeDrawingBrush.width = pencilWidth;
            gcanvas.freeDrawingCursor =
              "url(" + pencilCursorURL + ") 0 30, auto";
            currentState = gcanvas.toJSON([
              "uuid",
              "tool",
              "hasControls",
              "hasBorders",
              "selectable",
              "hoverCursor",
            ]);
            saveCurrentState();
          }
        }
      );
    }
  });
  $("#btnRemoveShape").click(function () {
    var obj = gcanvas.getActiveObject();
    if (obj) {
      gcanvas.remove(obj);
      gcanvas.renderAll();
      saveCurrentState();
    }
  });

  $("#ancText").click(function () {
    gcanvas.isDrawingMode = false;
    if ($("#textOptions").is(":visible")) {
      $("#textOptions").hide();
    } else {
      $(".subProperties").hide();
      $("#textOptions").show();
    }
  });

  function enableTextObjects() {
    gcanvas.forEachObject(function (obj) {
      console.log(obj);
      if (obj.tool == DRAWING_TEXT_TOOL) {
        obj.set({
          hasControls: true,
          hasBorders: true,
          selectable: true,
        });
      }
      gcanvas.renderAll();
    });
  }
  var textObj;

  function addTextObject(uuid) {
    console.log("addTextObject " + uuid);
    setDrawingTool(DRAWING_TEXT_TOOL);
    var textString =
      "This is simple text which can be edited\nas per your requirements";
    var fontFamily = "Times New Roman";
    var textAlign = "left";
    var textSize = "25";
    var textStyle = "normal";
    var textColor = "#000000";
    $(".divStyleBold i, .divStyleItalic i").css({
      "background-color": "#ffffff",
      color: "#000000",
    });
    $(".divAlign i").css({
      "background-color": "#ffffff",
      color: "#000000",
    });
    $("#alignleft i").css({
      "background-color": "#424242",
      color: "#ffffff",
    });
    textObj = new fabric.IText(textString, {
      fill: textColor,
      hasControls: true,
      hasBorders: true,
      hasRotatingPoint: true,
      selectable: true,
      fontFamily: fontFamily,
      textAlign: textAlign,
      fontStyle: textStyle,
      fontSize: textSize,
      top: 200,
      left: 200,
      padding: 5,
      uuid: uuid,
      tool: DRAWING_TEXT_TOOL,
    });
    $("#txtStyle").val(textObj.fontFamily);
    $("#txtText").val(textObj.text);
    $("#txtTextSize").val(textObj.fontSize);
    $("#txtClrVal").val(textObj.fill);
    $("#txtHexavalue").val(textObj.fill);
    $("#txtOutline").val(textObj.strokeWidth);
    $("#txtOutlineClrVal").val(textObj.stroke);
    $("#txtOutlineHexavalue").val(textObj.stroke);
    $("#txtBGClrVal").val(textObj.backgroundColor);
    $("#txtBGHexavalue").val(textObj.backgroundColor);
    lastObject = textObj;
    gcanvas.add(textObj);
    gcanvas.setActiveObject(textObj);
    enableTextObjects();
    gcanvas.renderAll();
    textObj.on("selected", function (e) {
      var obj = gcanvas.getActiveObject();
      console.log(obj);
      $("#txtStyle").val(obj.fontFamily);
      $("#txtText").val(obj.text);
      $("#txtTextSize").val(obj.fontSize);
      $("#txtClrVal").val(obj.fill);
      $("#txtHexavalue").val(obj.fill);
      $("#txtOutline").val(obj.strokeWidth);
      $("#txtOutlineClrVal").val(obj.stroke);
      $("#txtOutlineHexavalue").val(obj.stroke);
      $("#txtBGClrVal").val(obj.backgroundColor);
      $("#txtBGHexavalue").val(obj.backgroundColor);
      var alignopt = obj.textAlign;
      var styleopt = obj.textStyle;
      var weightopt = obj.fontWeight;
      $(".divAlign svg").css({
        "background-color": "#ffffff",
        color: "#000000",
      });
      $("#align" + alignopt + " svg").css({
        "background-color": "#424242",
        color: "#ffffff",
      });
      $(".divStyleBold svg").css({
        "background-color": "#ffffff",
        color: "#000000",
      });
      $("#style" + weightopt + " svg").css({
        "background-color": "#424242",
        color: "#ffffff",
      });
      $(".divStyleItalic svg").css({
        "background-color": "#ffffff",
        color: "#000000",
      });
      $("#style" + styleopt + " svg").css({
        "background-color": "#424242",
        color: "#ffffff",
      });
    });
    textObj.on("changed", function (e) {
      var obj = gcanvas.getActiveObject();
      $("#txtText").val(obj.text);
    });
  }
  $("#btnNewText").click(function () {
    var obj_id = uuid();
    addTextObject(obj_id);
    saveCurrentState();
  });
  $("#btnRemoveText").click(function () {
    var obj = gcanvas.getActiveObject();
    if (!obj) {
      return;
    }
    gcanvas.remove(obj);
    gcanvas.renderAll();
    saveCurrentState();
  });
  $("#txtStyle").change(function () {
    var obj = gcanvas.getActiveObject();
    if (obj) {
      obj.set({
        fontFamily: $(this).val(),
      });
      gcanvas.renderAll();
    }
  });
  var flagAlign = 1;
  $(".divAlign").click(function () {
    $(".divAlign svg").css({
      "background-color": "#ffffff",
      color: "#000000",
    });
    $(this).find("svg").css({
      "background-color": "#424242",
      color: "#ffffff",
    });
    var obj = gcanvas.getActiveObject();
    var v = $(this).attr("data-opt");
    if (obj) {
      obj.set({
        textAlign: v,
      });
      gcanvas.renderAll();
    }
  });
  var flagBold = 0;
  var flagItalic = 0;
  $(".divStyleBold").click(function () {
    var obj = gcanvas.getActiveObject();
    if (!obj) {
      return;
    }
    if (flagBold) {
      flagBold = 0;
      if (flagItalic == 1) {
        obj.set({
          fontStyle: "italic",
          fontWeight: "",
        });
      } else {
        obj.set({
          fontStyle: "normal",
          fontWeight: "",
        });
      }
      $(".divStyleBold svg").css({
        "background-color": "#ffffff",
        color: "#000000",
      });
    } else {
      flagBold = 1;
      if (flagItalic == 1) {
        obj.set({
          fontStyle: "italic",
          fontWeight: "bold",
        });
      } else {
        obj.set({
          fontStyle: "normal",
          fontWeight: "bold",
        });
      }
      $(".divStyleBold svg").css({
        "background-color": "#424242",
        color: "#ffffff",
      });
    }
    gcanvas.renderAll();
  });
  $(".divStyleItalic").click(function () {
    var obj = gcanvas.getActiveObject();
    if (!obj) {
      return;
    }
    if (flagItalic == 1) {
      flagItalic = 0;
      if (flagBold == 1) {
        obj.set({
          fontStyle: "",
          fontWeight: "bold",
        });
      } else {
        obj.set({
          fontStyle: "",
          fontWeight: "normal",
        });
      }
      $(".divStyleItalic svg").css({
        "background-color": "#ffffff",
        color: "#000000",
      });
    } else {
      flagItalic = 1;
      if (flagBold == 1) {
        obj.set({
          fontStyle: "italic",
          fontWeight: "bold",
        });
      } else {
        obj.set({
          fontStyle: "italic",
          fontWeight: "normal",
        });
      }
      $(".divStyleItalic svg").css({
        "background-color": "#424242",
        color: "#ffffff",
      });
    }
    gcanvas.renderAll();
  });
  $("#txtText").keyup(function () {
    var obj = gcanvas.getActiveObject();
    if (obj) {
      obj.set({
        text: $(this).val(),
      });
      gcanvas.renderAll();
    }
  });
  $("#txtTextSize").keyup(function () {
    var obj = gcanvas.getActiveObject();
    if (obj) {
      obj.set({
        fontSize: $(this).val(),
      });
      gcanvas.renderAll();
    }
  });
  $("#txtClrVal").on("propertychange input", function (e) {
    $("#txtHexavalue").val($(this).val());
    var obj = gcanvas.getActiveObject();
    if (obj) {
      obj.set({
        fill: $(this).val(),
      });
      gcanvas.renderAll();
    }
  });
  $("#txtBGClrVal").on("propertychange input", function (e) {
    $("#txtBGHexavalue").val($(this).val());
    var obj = gcanvas.getActiveObject();
    if (obj) {
      obj.set({
        backgroundColor: $(this).val(),
      });
      gcanvas.renderAll();
    }
  });
  $("#txtOutlineClrVal").on("propertychange input", function (e) {
    $("#txtOutlineHexavalue").val($(this).val());
    var obj = gcanvas.getActiveObject();
    var sval = $("#txtOutline").val();
    if (obj) {
      obj.set({
        stroke: $(this).val(),
        strokeWidth: sval,
      });
      gcanvas.renderAll();
    }
  });
  $("#txtOutline").keyup(function () {
    var obj = gcanvas.getActiveObject();
    var sval = $("#txtOutlineHexavalue").val();
    if (obj) {
      obj.set({
        stroke: $(this).val(),
        strokeWidth: sval,
      });
      gcanvas.renderAll();
    }
  });

  /* Image */
  $("#ancImage").click(function () {
    gcanvas.isDrawingMode = false;
    if ($("#imageOptions").is(":visible")) {
      $("#imageOptions").hide();
    } else {
      $(".subProperties").hide();
      $("#imageOptions").show();
    }
  });
  $("#btnNewImage").click(function () {
    $("#fileImage").click();
  });
  $("#fileImage").change(function (e) {
    var file = $("#fileImage").val();
    var exts = ["jpg", "jpeg", "png"];
    if (file.length <= 0) {
      $.messager.alert({
        title: "Alert",
        msg: "You did not select any file to upload",
        width: 350,
      });
      $("#fileImage").focus();
      return false;
    }
    var ext = file.split(".");
    ext = ext.reverse();
    if ($.inArray(ext[0].toLowerCase(), exts) < 0) {
      $.messager.alert({
        title: "Alert",
        msg: "Supported files are JPG, JPEG and PNG",
        width: 350,
      });
      $("#fileImage").focus();
      return false;
    }
    var formdata = new FormData();
    formdata.append("file", $("#fileImage")[0].files[0]);
    $("#wrapLoader").show();
    $("#wait").html("Uploading Image...");
    $.ajax({
      url: "#/image_upload.php",
      dataType: "json",
      method: "POST",
      cache: false,
      data: formdata,
      processData: false,
      contentType: false,
      success: function (data) {
        fabric.Image.fromURL(data.imgurl, function (img) {
          disableObjects();
          drawingTool = DRAWING_IMAGE_TOOL;
          img.uuid = uuid();
          img.hoverCursor = "default";
          img.tool = DRAWING_IMAGE_TOOL;
          if (img.width > 500) {
            img.scaleToWidth(500, false);
          }
          gcanvas.centerObject(img);
          lastObject = img;
          gcanvas.add(img);
          gcanvas.setActiveObject(img);
          gcanvas.calcOffset();
          gcanvas.renderAll();
          $("#wrapLoader").hide();
        });
        $("#fileImage").val("");
        $(".subProperties").hide();
      },
    });
  });
  $("#btnRemoveImage").click(function () {
    var obj = gcanvas.getActiveObject();
    if (!obj) {
      return;
    }
    gcanvas.remove(obj);
    gcanvas.renderAll();
    saveCurrentState();
  });

  /* PDF/PPT */

  $("#ancDocument").click(function () {
    disableObjects();
    gcanvas.isDrawingMode = false;
    $(".subProperties").hide();
    $("#fileDocument").click();
  });
  $("#fileDocument").change(function (e) {
    var file = $("#fileDocument").val();
    var exts = ["pdf", "ppt", "pptx", "doc", "docx", "odt", "rtf", "txt"];
    if (file.length <= 0) {
      $.messager.alert({
        title: "Alert",
        msg: "You did not select any file to upload",
        width: 350,
      });
      $("#fileDocument").focus();
      return false;
    }
    var ext = file.split(".");
    ext = ext.reverse();
    if ($.inArray(ext[0].toLowerCase(), exts) < 0) {
      $.messager.alert({
        title: "Alert",
        msg: "Supported files are PDF, PPT, DOC, TXT, RTF, ODT",
        width: 350,
      });
      $("#fileDocument").focus();
      return false;
    }
    var formdata = new FormData();
    formdata.append("file", $("#fileDocument")[0].files[0]);
    $("#wrapLoader").show();
    $("#wait").html("Uploading document...");
    $.ajax({
      url: "./document_upload.php",
      dataType: "json",
      method: "POST",
      cache: false,
      data: formdata,
      processData: false,
      contentType: false,
      success: function (data) {
        var oldBoardCount = boardCount + 1;
        if (boardCount == 1 && undoStack.length <= 0) {
          // It means first page is blank.
          $("#canvasContainer").html("");
          oldBoardCount = 1;
          boardCount = 0;
        }
        for (var index = 0; index < data.img_count; index++) {
          boardCount = boardCount + 1;
          var str = `<div id="canvasBoardDiv${boardCount}" class="canvasClass" style="width:100% !important;height:100% !important;"><canvas style="width:100% !important;height:100% !important;" id="canvasBoard${boardCount}"></canvas></div>`;

          $("#canvasContainer").append(str);

          var canvasObj = new fabric.Canvas(`canvasBoard${boardCount}`, {
            isDrawingMode: true,
            backgroundColor: "#ffffff",
            width: $("#center").width(),
            height: $("#center").height(),
            selection: false,
            imageSmoothingEnabled: false,
          });
          canvasInstances[boardCount - 1] = canvasObj;
          var image_url = data.image_url + "slide-" + index + ".jpg";
          setCanvasBackgroundImg(canvasObj, image_url);
        }
        $("#wrapLoader").hide();
        $("#easyui-pages").pagination("refresh", {
          total: boardCount,
          pageSize: 1,
        });
        $("#easyui-pages").pagination("select", oldBoardCount);
        $("#easyui-pages").show();
        $("#fileDocument").val("");
        $(".subProperties").hide();
      },
    });
  });

  function setCanvasBackgroundImg(canvasObj, image_url) {
    fabric.Image.fromURL(image_url, function (imageObj) {
      canvasObj.setBackgroundColor("#ffffff");
      scaleAndPositionImage(canvasObj, imageObj);
      saveCurrentState();
      $("#wrapLoader").hide();
    });
  }

  function scaleAndPositionImage(canvasObj, imageObj) {
    var imageWidth = imageObj.width;
    var imageHeight = imageObj.height;
    var imageScale = 1;
    while (true) {
      if (imageWidth > canvasWidth) {
        imageWidth = imageWidth * imageScale;
        imageHeight = imageHeight * imageScale;
        imageScale /= 1.001;
      } else {
        break;
      }
    }
    imageObj.scaleToWidth(imageWidth);
    imageObj.scaleToHeight(imageHeight);
    if (imageHeight > canvasObj.height) {
      canvasHeight = imageHeight;
      canvasWidth = canvasObj.width;
      canvasObj.setDimensions({
        width: canvasObj.width,
        height: canvasHeight,
      });
    }
    bgWidth = canvasWidth;
    bgHeight = canvasHeight;
    canvasObj.setBackgroundImage(
      imageObj,
      canvasObj.renderAll.bind(canvasObj),
      {
        backgroundImageStretch: false,
      }
    );
    canvasObj.renderAll();
  }
  $("#btnRemovePdf").click(function () {
    var obj = gcanvas.getActiveObject();
    if (!obj) {
      return;
    }
    gcanvas.remove(obj);
    gcanvas.renderAll();
    saveCurrentState();
  });

  $("#ancUndo").click(function () {
    $(".subProperties").hide();
    if (undoStack.length > 0) {
      stackProcessing = true;
      redoStack.push(currentState);
      currentState = undoStack.pop();
      // To avoid tainted Canvas issue.
      var size = currentState.objects ? currentState.objects.length : 0;
      for (var i = 0, len = size; i < len; i++) {
        if (
          currentState.objects[i] &&
          currentState.objects[i].type === "image"
        ) {
          currentState.objects[i].crossOrigin =
            currentState.objects[i].crossOrigin || "anonymous";
        }
      }
      if (currentState.backgroundImage) {
        currentState.backgroundImage.crossOrigin =
          currentState.backgroundImage.crossOrigin || "anonymous";
      }
      console.log(gcanvas);
      gcanvas.clear();
      gcanvas.setBackgroundImage("");
      gcanvas.backgroundImage = 0;
      gcanvas.setBackgroundColor("#ffffff");
      gcanvas.loadFromJSON(currentState, function () {
        gcanvas.renderAll();
        stackProcessing = false;
      });
    }
  });
  $("#ancRedo").click(function () {
    $(".subProperties").hide();
    if (redoStack.length > 0) {
      stackProcessing = true;
      undoStack.push(currentState);
      currentState = redoStack.pop();

      // To avoid tainted Canvas issue.
      var size = currentState.objects ? currentState.objects.length : 0;
      for (var i = 0, len = size; i < len; i++) {
        if (
          currentState.objects[i] &&
          currentState.objects[i].type === "image"
        ) {
          currentState.objects[i].crossOrigin =
            currentState.objects[i].crossOrigin || "anonymous";
        }
      }
      if (currentState.backgroundImage) {
        currentState.backgroundImage.crossOrigin =
          currentState.backgroundImage.crossOrigin || "anonymous";
      }
      gcanvas.clear();
      gcanvas.setBackgroundImage("");
      gcanvas.backgroundImage = 0;
      gcanvas.setBackgroundColor("#ffffff");
      gcanvas.loadFromJSON(currentState, function () {
        gcanvas.renderAll();
        stackProcessing = false;
      });
    }
  });
  $(document).keydown(function (e) {
    $(".subProperties").hide();
    if (e.which == 90 && e.metaKey && e.shiftKey) {
      e.preventDefault();
      $("#ancRedo").click();
    } else if (e.which == 89 && e.ctrlKey) {
      e.preventDefault();
      $("#ancRedo").click();
    } else if (e.which == 90 && e.ctrlKey) {
      e.preventDefault();
      $("#ancUndo").click();
    } else if (e.which == 90 && e.metaKey) {
      e.preventDefault();
      $("#ancUndo").click();
    } else if (e.which == 127) {
      e.preventDefault();
    } else if (e.which == 187 && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (drawingTool == DRAWING_ERASER_TOOL) {
        var penSize = parseInt($("#eraserSlide").numberspinner("getValue"));
        penSize++;
        $("#eraserSlide").numberspinner("setValue", penSize);
      } else {
        var penSize = parseInt($("#lineSlide").numberspinner("getValue"));
        penSize++;
        $("#lineSlide").numberspinner("setValue", penSize);
      }
    } else if (e.which == 189 && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (drawingTool == DRAWING_ERASER_TOOL) {
        var penSize = parseInt($("#eraserSlide").numberspinner("getValue"));
        penSize--;
        $("#eraserSlide").numberspinner("setValue", penSize);
      } else {
        var penSize = parseInt($("#lineSlide").numberspinner("getValue"));
        penSize--;
        $("#lineSlide").numberspinner("setValue", penSize);
      }
    }
  });
  $("html").keyup(function (e) {
    if (e.keyCode == 46 || e.keyCode == 8) {
      var cobj = gcanvas.getActiveObject();
      if (cobj) {
        if (cobj.hasOwnProperty("text")) {
          return;
        }
        gcanvas.remove(cobj);
      }
      $(".divStyleBold i, .divStyleItalic i").css({
        "background-color": "#ffffff",
        color: "#000000",
      });
      $(".divAlign i").css({
        "background-color": "#ffffff",
        color: "#000000",
      });
      $("#alignleft i").css({
        "background-color": "#424242",
        color: "#ffffff",
      });
      $("#txtStyle").val("Times New Roman");
      $("#txtText").val("Sample Text");
      $("#txtTextSize").val(20);
      $("#txtClrVal").val("#ff0000");
      $("#txtHexavalue").val("#ff0000");
      $("#txtOutline").val(1);
      $("#txtOutlineClrVal").val("#000000");
      $("#txtOutlineHexavalue").val("#000000");
      $("#txtBGClrVal").val("#000000");
      $("#txtBGHexavalue").val("#000000");
      $("#txtShapeOutline").val(2);
      $("#txtShapeOutlineHexavalue").val("#000000");
      $("#txtShapeOutlineClrVal").val("#000000");
      $("#txtFillClrVal").val("#000000");
      $("#txtFillClrHexa").val("#000000");
      gcanvas.renderAll();
      e.preventDefault();
      return false;
    }
  });
  $("#ancPattern").click(function () {
    disableObjects();
    if ($("#bgPattern").is(":visible")) {
      $("#bgPattern").hide();
    } else {
      $(".subProperties").hide();
      $("#bgPattern").show();
    }
  });
  $("#btnDisplayMenu").hide();
  $("#btnShowMenu").click(function (event) {
    event.stopPropagation();
    $("#btnDisplayMenu").toggle();
  });
  $(document).click(function () {
    var $el = $("#btnDisplayMenu");
    if ($el.is(":visible")) {
      $el.toggle();
    }
  });
  $("#btnDisplayMenu").click(function (event) {
    event.stopPropagation();
  });
  $("#center").panel({
    onResize: function (width, height) {
      height = height - 25;
      $("#toolbox").height(height);
      $("#stage").height(height);
      $("#stage").width(width);
      if (isModerator) {
        canvasWidth = width;
        if (canvasHeight < height) {
          canvasHeight = height;
        }
        canvasHeight = height;
        if (bgHeight > canvasHeight) {
          canvasHeight = bgHeight;
        }
        if (bgWidth < canvasWidth) {
          canvasWidth = bgWidth;
        }
        gcanvas.setDimensions({
          width: canvasWidth,
          height: canvasHeight,
        });
        gcanvas.calcOffset();
        gcanvas.renderAll();
      }
    },
  });
  $("#ancDrawing").bind("click", function (event) {
    $("#whiteboard").text("Whiteboard");
    currentMode = DRAWING_MODE_EVENT;
    $("#stage").show();
    $("#editorStage").hide();
    $(".dialog-toolbar").hide();
    $(".wr-left").show();
    $("#west").css("width", "55");
    $("#cc").layout("panel", "west").panel("resize", {
      width: 55,
    });
    $("#center").css("padding-left", 10);
    $("#cc").layout("resize");
    if (boardCount > 0) {
      $("#easyui-pages").show();
    }
    gcanvas.isDrawingMode = true;
    $("#west").css({
      opacity: 1,
    });
    $("#editorStage").texteditor("enable");
  });
  $("#ancEditor").bind("click", function (event) {
    $("#whiteboard").text("Editor");
    currentMode = EDITOR_MODE_EVENT;
    $("#stage").hide();
    $("#editorStage").show();
    $(".dialog-toolbar").show();
    $(".wr-left").hide();
    $("#cc").layout("panel", "west").panel("resize", {
      width: 1,
    });
    $("#center").css("padding-left", 0);
    $("#cc").layout("resize");
    $("#easyui-pages").hide();
    $(".subProperties").hide();
    if (isModerator) {
      gcanvas.isDrawingMode = true;
      $("#west").css({
        opacity: 1,
      });
      $("#editorStage").texteditor("enable");
    }
  });

  /**
   * Handles the user count at tab label
   */
  var userCount = 0;
  function handleMouseDownEvent(data) {
    var pointer = data.pointer;
    var event = data.drawingTool;
    var uuid = data.uuid;
    if (event == DRAWING_PENCIL_TOOL) {
      const options = {
        pointer,
        e: {},
      };
      remoteBrush = new fabric.PencilBrush(gcanvas);
      remoteBrush.color = pencilColor;
      remoteBrush.width = pencilWidth;
      remoteBrush.onMouseDown(pointer, options);
      path = new fabric.Path(`M ${pointer.x} ${pointer.y}`, {
        strokeWidth: pencilWidth,
        stroke: pencilColor,
        fill: "",
        selectable: false,
        hasRotatingPoint: false,
      });
      $("#eraser-cursor").css({
        display: "none",
      });
      $("#cursor-pointer").css({
        display: "block",
        top: pointer.y + 55,
        left: pointer.x + 20,
      });
    } else if (event == DRAWING_ERASER_TOOL) {
      const options = {
        pointer,
        e: {},
      };
      remoteBrush = new fabric.PencilBrush(gcanvas);
      remoteBrush.color = eraserColor;
      remoteBrush.width = eraserWidth;
      remoteBrush.onMouseDown(pointer, options);
      path = new fabric.Path(`M ${pointer.x} ${pointer.y}`, {
        strokeWidth: eraserWidth,
        stroke: eraserColor,
        fill: "",
        selectable: false,
        hasRotatingPoint: false,
      });
      $("#cursor-pointer").css({
        display: "none",
      });
      $("#eraser-cursor").css({
        display: "block",
        top: pointer.y + 55,
        left: pointer.x + 20,
      });
    } else if (
      event == DRAWING_SELECT_TOOL ||
      event == DRAWING_IMAGE_TOOL ||
      event == DRAWING_TEXT_TOOL
    ) {
      isDrawing = 1;
      $("#eraser-cursor").css({
        display: "none",
      });
      $("#cursor-pointer").css({
        display: "block",
        top: pointer.y + 55,
        left: pointer.x + 20,
      });
    } else if (event == DRAWING_LINE_TOOL) {
      isDrawing = 1;
      DrawLineMouseDown(pointer, uuid);
      $("#eraser-cursor").css({
        display: "none",
      });
      $("#cursor-pointer").css({
        display: "block",
        top: pointer.y + 55,
        left: pointer.x + 20,
      });
    } else if (event == DRAWING_ARROW_TOOL) {
      isDrawing = 1;
      DrawArrowMouseDown(pointer, uuid);
      $("#eraser-cursor").css({
        display: "none",
      });
      $("#cursor-pointer").css({
        display: "block",
        top: pointer.y + 55,
        left: pointer.x + 20,
      });
    } else if (event == DRAWING_RECT_TOOL) {
      isDrawing = 1;
      DrawRectMouseDown(pointer, uuid);
      $("#eraser-cursor").css({
        display: "none",
      });
      $("#cursor-pointer").css({
        display: "block",
        top: pointer.y + 55,
        left: pointer.x + 20,
      });
    } else if (event == DRAWING_SQUARE_TOOL) {
      isDrawing = 1;
      DrawSquareMouseDown(pointer, uuid);
      $("#eraser-cursor").css({
        display: "none",
      });
      $("#cursor-pointer").css({
        display: "block",
        top: pointer.y + 55,
        left: pointer.x + 20,
      });
    } else if (event == DRAWING_TRIANGLE_TOOL) {
      isDrawing = 1;
      DrawTriangleMouseDown(pointer, uuid);
      $("#eraser-cursor").css({
        display: "none",
      });
      $("#cursor-pointer").css({
        display: "block",
        top: pointer.y + 55,
        left: pointer.x + 20,
      });
    } else if (event == DRAWING_CIRCLE_TOOL) {
      isDrawing = 1;
      DrawCircleMouseDown(pointer, uuid);
      $("#eraser-cursor").css({
        display: "none",
      });
      $("#cursor-pointer").css({
        display: "block",
        top: pointer.y + 55,
        left: pointer.x + 20,
      });
    } else if (event == DRAWING_ELLIPSE_TOOL) {
      isDrawing = 1;
      DrawEllipseMouseDown(pointer, uuid);
      $("#eraser-cursor").css({
        display: "none",
      });
      $("#cursor-pointer").css({
        display: "block",
        top: pointer.y + 55,
        left: pointer.x + 20,
      });
    }
  }

  function handleObjectSelectedEvent(data) {
    var event = data.drawingTool;
    if (
      event &&
      (event == DRAWING_SELECT_TOOL ||
        event == DRAWING_IMAGE_TOOL ||
        event == DRAWING_TEXT_TOOL)
    ) {
      gcanvas.forEachObject(function (obj) {
        if (obj.uuid && obj.uuid === data.uuid) {
          isDrawing = 1;
          //                    gcanvas.bringToFront(obj);
          gcanvas.renderAll();
        }
      });
    }
  }

  function handleMouseMoveEvent(data) {
    var pointer = data.pointer;
    var event = data.drawingTool;
    if (
      isDrawing &&
      event &&
      (event == DRAWING_SELECT_TOOL ||
        event == DRAWING_IMAGE_TOOL ||
        event == DRAWING_TEXT_TOOL)
    ) {
      gcanvas.forEachObject(function (obj) {
        if (obj.uuid && obj.uuid === data.uuid) {
          //                   gcanvas.bringToFront(obj);
          obj.set({
            angle: data.angle,
            zoomX: data.zoomX,
            zoomY: data.zoomY,
            scaleX: data.scaleX,
            scaleY: data.scaleY,
            width: data.width,
            height: data.height,
            x1: data.x1,
            x2: data.x2,
            y1: data.y1,
            y2: data.y2,
          });
          obj.set("left", data.left);
          obj.set("top", data.top);
          gcanvas.renderAll();
        }
      });
      $("#eraser-cursor").css({
        display: "none",
      });
      $("#cursor-pointer").css({
        display: "block",
        top: pointer.y + 55,
        left: pointer.x + 20,
      });
    } else if (event == DRAWING_PENCIL_TOOL || event == DRAWING_ERASER_TOOL) {
      const options = {
        pointer,
        e: {},
      };
      if (remoteBrush) {
        remoteBrush.onMouseMove(pointer, options);
      }
      if (path) {
        const newLine = ["L", pointer.x, pointer.y];
        path.path.push(newLine);
      }
      if (event == DRAWING_PENCIL_TOOL) {
        $("#eraser-cursor").css({
          display: "none",
        });
        $("#cursor-pointer").css({
          display: "block",
          top: pointer.y + 55,
          left: pointer.x + 20,
        });
      } else if (event == DRAWING_ERASER_TOOL) {
        $("#cursor-pointer").css({
          display: "none",
        });
        $("#eraser-cursor").css({
          display: "block",
          top: pointer.y + 55,
          left: pointer.x + 20,
        });
      }
    } else if (event == DRAWING_LINE_TOOL) {
      DrawLineMouseMove(pointer);
      $("#eraser-cursor").css({
        display: "none",
      });
      $("#cursor-pointer").css({
        display: "block",
        top: pointer.y + 55,
        left: pointer.x + 20,
      });
    } else if (event == DRAWING_ARROW_TOOL) {
      DrawArrowMouseMove(pointer);
      $("#eraser-cursor").css({
        display: "none",
      });
      $("#cursor-pointer").css({
        display: "block",
        top: pointer.y + 55,
        left: pointer.x + 20,
      });
    } else if (event == DRAWING_RECT_TOOL) {
      DrawRectMouseMove(pointer);
      $("#eraser-cursor").css({
        display: "none",
      });
      $("#cursor-pointer").css({
        display: "block",
        top: pointer.y + 55,
        left: pointer.x + 20,
      });
    } else if (event == DRAWING_SQUARE_TOOL) {
      DrawSquareMouseMove(pointer);
      $("#eraser-cursor").css({
        display: "none",
      });
      $("#cursor-pointer").css({
        display: "block",
        top: pointer.y + 55,
        left: pointer.x + 20,
      });
    } else if (event == DRAWING_TRIANGLE_TOOL) {
      DrawTriangleMouseMove(pointer);
      $("#eraser-cursor").css({
        display: "none",
      });
      $("#cursor-pointer").css({
        display: "block",
        top: pointer.y + 55,
        left: pointer.x + 20,
      });
    } else if (event == DRAWING_CIRCLE_TOOL) {
      DrawCircleMouseMove(pointer);
      $("#eraser-cursor").css({
        display: "none",
      });
      $("#cursor-pointer").css({
        display: "block",
        top: pointer.y + 55,
        left: pointer.x + 20,
      });
    } else if (event == DRAWING_ELLIPSE_TOOL) {
      DrawEllipseMouseMove(pointer);
      $("#eraser-cursor").css({
        display: "none",
      });
      $("#cursor-pointer").css({
        display: "block",
        top: pointer.y + 55,
        left: pointer.x + 20,
      });
    } else {
      $("#eraser-cursor").css({
        display: "none",
      });
      $("#cursor-pointer").css({
        display: "block",
        top: pointer.y + 55,
        left: pointer.x + 20,
      });
    }
  }

  function handleMouseUpEvent(data) {
    var pointer = data.pointer;
    var uuid = data.uuid;
    var event = data.drawingTool;
    if (event == DRAWING_PENCIL_TOOL || event == DRAWING_ERASER_TOOL) {
      var finishedPath = new fabric.Path(path.path, {
        strokeWidth: path.strokeWidth,
        stroke: path.stroke,
        fill: "",
        selectable: false,
        hasRotatingPoint: false,
      });
      gcanvas.add(finishedPath);
      path = null;
      remoteBrush = null;
      finishedPath = null;
      if (event == DRAWING_PENCIL_TOOL) {
        $("#eraser-cursor").css({
          display: "none",
        });
        $("#cursor-pointer").css({
          display: "block",
          top: pointer.y + 55,
          left: pointer.x + 20,
        });
      } else if (event == DRAWING_ERASER_TOOL) {
        $("#cursor-pointer").css({
          display: "none",
        });
        $("#eraser-cursor").css({
          display: "block",
          top: pointer.y + 55,
          left: pointer.x + 20,
        });
      }
    } else if (
      event == DRAWING_SELECT_TOOL ||
      event == DRAWING_IMAGE_TOOL ||
      event == DRAWING_TEXT_TOOL
    ) {
      DrawSelectMouseUp(pointer);
      $("#eraser-cursor").css({
        display: "none",
      });
      $("#cursor-pointer").css({
        display: "block",
        top: pointer.y + 55,
        left: pointer.x + 20,
      });
    } else if (event == DRAWING_LINE_TOOL) {
      DrawLineMouseUp(pointer);
      $("#eraser-cursor").css({
        display: "none",
      });
      $("#cursor-pointer").css({
        display: "block",
        top: pointer.y + 55,
        left: pointer.x + 20,
      });
    } else if (event == DRAWING_ARROW_TOOL) {
      DrawArrowMouseUp(pointer, uuid);
      $("#eraser-cursor").css({
        display: "none",
      });
      $("#cursor-pointer").css({
        display: "block",
        top: pointer.y + 55,
        left: pointer.x + 20,
      });
    } else if (event == DRAWING_RECT_TOOL) {
      DrawRectMouseUp(pointer);
      $("#eraser-cursor").css({
        display: "none",
      });
      $("#cursor-pointer").css({
        display: "block",
        top: pointer.y + 55,
        left: pointer.x + 20,
      });
    } else if (event == DRAWING_SQUARE_TOOL) {
      DrawSquareMouseUp(pointer);
      $("#eraser-cursor").css({
        display: "none",
      });
      $("#cursor-pointer").css({
        display: "block",
        top: pointer.y + 55,
        left: pointer.x + 20,
      });
    } else if (event == DRAWING_TRIANGLE_TOOL) {
      DrawTriangleMouseUp(pointer);
      $("#eraser-cursor").css({
        display: "none",
      });
      $("#cursor-pointer").css({
        display: "block",
        top: pointer.y + 55,
        left: pointer.x + 20,
      });
    } else if (event == DRAWING_CIRCLE_TOOL) {
      DrawCircleMouseUp(pointer);
      $("#eraser-cursor").css({
        display: "none",
      });
      $("#cursor-pointer").css({
        display: "block",
        top: pointer.y + 55,
        left: pointer.x + 20,
      });
    } else if (event == DRAWING_ELLIPSE_TOOL) {
      DrawEllipseMouseUp(pointer);
      $("#eraser-cursor").css({
        display: "none",
      });
      $("#cursor-pointer").css({
        display: "block",
        top: pointer.y + 55,
        left: pointer.x + 20,
      });
    }
    gcanvas.renderAll();
  }
  $("#cc").layout({
    onLoad: function () {
      alert("loaded successfully");
    },
  });
  $("#wrapLoader").hide();
  $("#moderatorVideo .name").show();
  $("#moderatorStage").css("visibility", "visible");
  $("#block").window("close");
  $("#west").css("width", "55");
  $("#cc").layout("panel", "west").panel("resize", {
    width: 55,
  });
  $("#cc").layout("resize");

  $(".wr-left").show();
  $("#cc").show();
  //$('.db-nav').show();
  $("#stage").show();
  $("#editorStage").hide();
  $(".dialog-toolbar").hide();
  $("#cc").layout("resize");

  /* Download */
  $("#ancDownload").click(function () {
    $("#cc").layout("panel", "east").panel({
      // title:'Download / Upload',
      // iconCls:'icon-upload'
    });
    gcanvas.isDrawingMode = false;
    gcanvas.forEachObject(function (obj) {
      obj.set({
        hasControls: false,
        hasBorders: false,
        selectable: false,
      });
    });
    gcanvas.renderAll();
    if ($("#downloadOptions").is(":visible")) {
      $("#downloadOptions").hide();
    } else {
      $(".subProperties").hide();
      $("#downloadOptions").show();
    }
  });
  var dimgCount = 1;
  $("#ancDwnJson").click(function () {
    var canvasData = gcanvas.toJSON();
    canvasData =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(canvasData));
    var a = $("<a>")
      .attr("href", canvasData)
      .attr("download", "whiteboard-" + dimgCount + ".board")
      .appendTo("body");
    a[0].click();
    a.remove();
    dimgCount++;
  });
  $("#ancDwnJpeg").click(function () {
    var canvasData = gcanvas.toDataURL();
    var a = $("<a>")
      .attr("href", canvasData)
      .attr("download", "whiteboard-" + dimgCount + ".jpg")
      .appendTo("body");
    a[0].click();
    a.remove();
    dimgCount++;
  });

  /* Upload JSON */
  $("#ancUpload").click(function () {
    eraserFlag = false;
    gcanvas.isDrawingMode = false;
    gcanvas.forEachObject(function (obj) {
      obj.set({
        hasControls: false,
        hasBorders: false,
        selectable: false,
      });
    });
    gcanvas.renderAll();
    $(".subProperties").hide();
    /*
                          if( $("#cc").layout('panel','east').panel('options').collapsed ){
                             $('#cc').layout('expand','east');
                          }
                    */
    $("#uploadOptions").show();
  });
  $("#btnUpload").click(function () {
    $("#fileJson").trigger("click");
  });
  $("#fileJson").change(function (e) {
    var file = $("#fileJson").val();
    var exts = ["board"];
    if (file.length <= 0) {
      alert("Please select a file from local drive.");
      $("#fileJson").focus();
      return false;
    }
    var ext = file.split(".");
    ext = ext.reverse();
    if ($.inArray(ext[0].toLowerCase(), exts) < 0) {
      alert("Please select board format files only.");
      $("#fileJson").focus();
      return false;
    }
    var inputs = new FormData();
    inputs.append("jsonfile", $("#fileJson").prop("files")[0]);
    var url = "/meet/upload_board.php";
    $(".wrapLoader").show();
    $.ajax({
      url: "./upload_board.php",
      method: "POST",
      cache: false,
      data: inputs,
      processData: false,
      contentType: false,
    }).done(function (msg) {
      gcanvas.loadFromJSON(msg, gcanvas.renderAll.bind(gcanvas));
      gcanvas.forEachObject(function (obj) {
        if (obj.type == "path") {
          obj.set({
            hasControls: false,
            hasBorders: false,
            selectable: false,
          });
        }
      });
      $(".wrapLoader").hide();
   
    });
  });
});
