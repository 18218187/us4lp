var secondOffer = function (url) {
  var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  var iOS =
    /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent) && !window.MSStream;
  var secondOfferLink =
    "http://offerstrace.com/cxk3l7k.php?lp=1";
  var searchParams = new URLSearchParams(window.location.search);
  var campaignQuery = searchParams.get("campaign");

  if (campaignQuery) {
    secondOfferLink += "&t2=" + campaignQuery;
  }
  if (isSafari && iOS) {
    window.location.href = url;
  } else {
    window.open(url, "_blank");
    window.location.href = secondOfferLink;
  }
};
