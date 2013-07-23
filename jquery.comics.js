/*
// FIXME: Cancel the transition effect if button is pressed again
// TODO: Show the full page function...
// TODO: Add Frame Editor...
// TODO: Mobile Add touch controls...
// TODO: Disable buttons when on end?
// TODO: Positional Click Events
// TODO: Read the comic directly from a folder (auto parse source.js file or something...)
// TODO: Instead of total pages, show total frames...
*/
/*! jQomics v0.2.0 | (c) 2013 Roy Simkes | https://raw.github.com/radalin/jqomics/master/LICENSE */
$.fn.comics = function(comic, withControls) {
  this.pages = comic.pages, this.currentPageIndex = 0, this.currentFrameIndex = 0, this.defaultTransitionSpeed = 1000, this.title = comic.title, this.path = "", this.totalFrames = 0;
  if (!!comic.sourcePath) {
    this.path = comic.sourcePath;
    if (this.path.indexOf("/", this.path.length - 1) !== -1) {
      this.path += "/";
    }
  }
  this.init = function() {
    var self = this;
    $.each(self.pages, function(i, el) {
      self.pages[i]["index"] = i;
      self.append(
        $("<img>")
          .attr("src", self.path + el.source)
          .addClass("page page-" + i)
          .css({
            "position": "relative",
            "outline": 0
          })
      );
      self.totalFrames += el.frames.length;
    });
    this.css("overflow", "hidden");
    if (withControls) {
      this.bindControls();
    }    
    this.jumpToPage(0);
  };
  this.bindControls = function() {
    var self = this;
    $(".frame-prev-btn").off("click").on("click", function() {
      self.previousFrame();
    });
    $(".frame-next-btn").off("click").on("click", function() {
      self.nextFrame();
    });
    $(".page-prev-btn").off("click").on("click", function() {
      self.previousPage();
    });
    $(".page-next-btn").off("click").on("click", function() {
      self.nextPage();
    });
    self.off("dblclick").on("dblclick", function() {
      self.nextFrame()
    });
  };
  this.nextPage = function() {
    if (this.currentPageIndex >= this.pages.length - 1) {
      // TODO: show an alert or something...
      console.log("last page");
      return;
    }
    this.currentPageIndex++;
    this.jumpToPageAndFrame(this.currentPageIndex, 0)
  };
  this.previousPage = function(fromFrame) {
    if (this.currentPageIndex <= 0) {
      // TODO: Show an alert or something...
      console.log("first page");
      return;
    }
    this.currentPageIndex--;
    var frameIndex = 0;
    if (fromFrame) {
      frameIndex = this.currentPage.frames.length - 1;
    }
    this.jumpToPageAndFrame(this.currentPageIndex, frameIndex)
  };
  this.jumpToPage = function(pageIndex) {
    this.jumpToPageAndFrame(pageIndex, 0, true);
  };
  this.jumpToPageAndFrame = function(pageIndex, frameIndex, instant) {
    this.currentPageIndex = pageIndex;
    this.currentFrameIndex = frameIndex;
    this.currentPage = this.pages[this.currentPageIndex];
    this.currentFrame = this.currentPage.frames[this.currentFrameIndex];
    this.__changeFrame(this.currentFrame, instant);
    this.__changePage(this.currentPage);
    this.__updatePageInfo();
  };
  this.nextFrame = function() {
    if (this.currentFrameIndex + 1 >= this.currentPage.frames.length) {
      this.nextPage();
    } else {
      this.currentFrame = this.currentPage.frames[++this.currentFrameIndex];
      this.__changeFrame(this.currentFrame);
    }
  };
  this.previousFrame = function() {
    if (this.currentFrameIndex - 1 < 0) {
      this.previousPage(true);
    } else {
      this.currentFrame = this.currentPage.frames[--this.currentFrameIndex];
      this.__changeFrame(this.currentFrame);
    }
  };
  this.__changePage = function(page) {
    this.find(".page-current").fadeOut(this.defaultTransitionSpeed, function() {
      $(this).hide().removeClass("page-current");
    });
    this.find(".page-" + page.index).fadeIn(this.defaultTransitionSpeed, function() {
      $(this).addClass("page-current").show();
    })
  };
  this.__changeFrame = function(newFrame, instant) {
    var speed = this.defaultTransitionSpeed;
    if (instant) {
      speed = 1;
    }
    var position = {};
    if (newFrame.width) {
      position["width"] = newFrame.width;
    }
    if (newFrame.height) {
      position["height"] = newFrame.height;
    }
    if (position["width"] || position["height"]) {
      this.animate(position, speed)
    }
    this.find(".page-" + this.currentPageIndex).animate({
      "left": newFrame.x,
      "top": newFrame.y
    }, speed);
  };
  this.__updatePageInfo = function() {
    $(".page-info").html(this.currentPageIndex + 1 + " / " + this.pages.length);
  };
  
  //Now Initialize it...
  this.init();
  return this;
}