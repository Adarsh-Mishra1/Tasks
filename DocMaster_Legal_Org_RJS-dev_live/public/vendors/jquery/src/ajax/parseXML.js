define(["../core"], function (jQuery) {
  // Cross-browser xml parsing
  jQuery.parseXML = function (data) {
    var xml;
    if (!data || typeof data !== "string") {
      return null;
    }

    // Support: IE9
    try {
      xml = new window.DOMParser().parseFromString(data, "text/xml");
    } catch (e) {
      xml = undefined;
    }

    if (!xml || xml.getElementsByTagName("parsererror").length) {
      jQuery.error("Invalid XML: " + data);
    }
    return xml;
  };

  return jQuery.parseXML;
});
