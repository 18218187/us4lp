var secondOffer = function (url) {
  var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  var iOS =
    /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent) && !window.MSStream;
  var secondOfferLink =
    "https://securelink-dt.com/?a=239394&o=92153&c=0&co=297426&mt=7";
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
