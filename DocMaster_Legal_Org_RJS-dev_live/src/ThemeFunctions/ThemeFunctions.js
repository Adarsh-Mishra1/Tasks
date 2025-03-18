//ThemeFunctions.js
import * as $ from "jquery";

const openUpMenu = function () {
  $("#sidebar-menu").find("li").removeClass("active active-sm");
  $("#sidebar-menu").find("li ul").slideUp();
};

const setContentHeight = function () {
  // reset height
  $(".right_col").css("min-height", $(window).height());

  var bodyHeight = $("body").outerHeight(),
    footerHeight = $("body").hasClass("footer_fixed")
      ? -10
      : $("footer").height(),
    leftColHeight =
      $(".left_col").eq(1).height() + $(".sidebar-footer").height(),
    contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

  // normalize content
  contentHeight -= $(".nav_menu").height() + footerHeight;

  $(".right_col").css("min-height", contentHeight);
};

export const initSideBar = (val) => {
  // console.log("initSideBar_value", val);
  var target = $(val.target);
  // console.log("initSideBar_target", target);
  var $li = $(target).parent();

  if ($li.is(".active")) {
    $li.removeClass("active active-sm");
    $("ul:first", $li).slideUp(function () {
      setContentHeight();
    });
  } else {
    // prevent closing menu if we are on child menu
    if (!$li.parent().is(".child_menu")) {
      openUpMenu();
    } else {
      if ($("body").is("nav-sm")) {
        if (!$li.parent().is("child_menu")) {
          openUpMenu();
        }
      }
    }

    $li.addClass("active");

    $("ul:first", $li).slideDown(function () {
      setContentHeight();
    });
  }
  // $("#sidebar-menu")
  //   .find("a")
  //   .on("click", function (ev) {
  //     ev.preventDefault();
  //     console.log("AMAN")

  //     }
  // });

  setContentHeight();

  // var CURRENT_URL = window.location.href.split("#")[0].split("?")[0];
  // // check active menu
  // $("#sidebar-menu")
  //   .find('a[href="' + CURRENT_URL + '"]')
  //   .parent("li")
  //   .addClass("current-page");

  // $("#sidebar-menu")
  //   .find("a")
  //   .filter(function () {
  //     return this.href == CURRENT_URL;
  //   })
  //   .parent("li")
  //   .addClass("current-page")
  //   .parents("ul")
  //   .slideDown(function () {
  //     setContentHeight();
  //   })
  //   .parent()
  //   .addClass("active");

  // setContentHeight();

  // fixed sidebar
  if ($.fn.mCustomScrollbar) {
    $(".menu_fixed").mCustomScrollbar({
      autoHideScrollbar: true,
      theme: "minimal",
      mouseWheel: { preventDefault: true },
    });
  }
};

export const toggleSideBar = () => {
  if ($("body").hasClass("nav-md")) {
    $("#sidebar-menu").find("li.active ul").hide();
    $("#sidebar-menu")
      .find("li.active")
      .addClass("active-sm")
      .removeClass("active");
  } else {
    $("#sidebar-menu").find("li.active-sm ul").show();
    $("#sidebar-menu")
      .find("li.active-sm")
      .addClass("active")
      .removeClass("active-sm");
  }

  $("body").toggleClass("nav-md nav-sm");

  setContentHeight();

  $(".dataTable").each(function () {
    $(this).dataTable().fnDraw();
  });
};
