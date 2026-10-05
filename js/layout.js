



(function () {

  var menu = [
    { name: "Home", link: "index.html" },
    { name: "Watchlist", link: "watchlist.html" },
    {
      name: "Trophies",
      children: [
        { name: "Trophies", link: "trophies.html", icon: "bi-trophy-fill" },
        { name: "Try Out The Game", link: "try-game.html", icon: "bi-controller" }
      ]
    },
    { name: "Projects", link: "projects.html" },
    {
      name: "Journey",
      children: [
        { name: "The Journey", link: "journey.html", icon: "bi-signpost-split-fill" },
        { name: "About Me", link: "about.html", icon: "bi-person-heart" }
      ]
    }
  ];

  var contacts = [
    { icon: "bi-apple",          text: "saeed.alame@icloud.com", link: "#" },
    { icon: "bi-google",         text: "saeedalameh29@gmail.com", link: "#" },
    { icon: "bi-telephone-fill", text: "+961 71 814 233",         link: "#" },
    { icon: "bi-github",         text: "GitHub",                  link: "#/" }   // <-- put your GitHub profile link here
  ];

  var socials = [
    { icon: "bi-instagram", text: "saeed._.alame",   link: "#" },
    { icon: "bi-reddit",    text: "saeed.alame",     link: "#" },
    { icon: "bi-twitter-x", text: "@saeedalameh",    link: "#" },
    { icon: "bi-snapchat",  text: "maliketh0_0svrx", link: "#" }
  ];


  var currentPage = window.location.pathname.split("/").pop();
  if (currentPage === "") { currentPage = "index.html"; }

  var links = "";

  menu.forEach(function (item) {
    if (item.children) {
      var isActive = item.children.some(function (child) { return child.link === currentPage; });
      links += '<li class="nav-item dropdown">';
      links += '<a class="nav-link dropdown-toggle' + (isActive ? " active" : "") + '" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">' + item.name + '</a>';
      links += '<ul class="dropdown-menu dropdown-menu-end">';
      item.children.forEach(function (child) {
        links += '<li><a class="dropdown-item' + (child.link === currentPage ? " active" : "") + '" href="' + child.link + '"><i class="bi ' + child.icon + '"></i>' + child.name + '</a></li>';
      });
      links += '</ul></li>';
    } else {
      links += '<li class="nav-item"><a class="nav-link' + (item.link === currentPage ? " active" : "") + '" href="' + item.link + '">' + item.name + '</a></li>';
    }
  });

  var navbar =
    '<nav class="navbar navbar-expand-lg fixed-top site-nav">' +
      '<div class="container">' +
        '<a class="navbar-brand" href="index.html"><span class="brand-logo"><b>S</b></span>Saeed Alame</a>' +
        '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>' +
        '<div class="collapse navbar-collapse" id="mainNav"><ul class="navbar-nav ms-auto align-items-lg-center">' + links + '</ul></div>' +
      '</div>' +
    '</nav>';

  var header = document.getElementById("site-header");
  if (header) { header.innerHTML = navbar; }


  var contactHtml = "";
  contacts.forEach(function (c) {
    contactHtml += '<li><a href="' + c.link + '"><span class="icon-circle"><i class="bi ' + c.icon + '"></i></span>' + c.text + '</a></li>';
  });

  var socialHtml = "";
  socials.forEach(function (s) {
    socialHtml += '<a class="social-pill" href="' + s.link + '" target="_blank" rel="noopener"><i class="bi ' + s.icon + '"></i>' + s.text + '</a>';
  });

  var year = new Date().getFullYear();

  var footerHtml =
    '<div class="container">' +
      '<div class="row g-5">' +
        '<div class="col-lg-4">' +
          '<div class="footer-brand gradient-text">Saeed Alame</div>' +
          '<p class="mt-3">Student, web builder, trophy hunter and future cloud architect. Thanks for stopping by &mdash; let\'s build something great.</p>' +
        '</div>' +
        '<div class="col-lg-4" id="contact">' +
          '<div class="footer-heading">Contacts</div>' +
          '<ul class="contact-list">' + contactHtml + '</ul>' +
        '</div>' +
        '<div class="col-lg-4">' +
          '<div class="footer-heading">Social Media</div>' +
          socialHtml +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom">' +
        '<span>Created by <strong class="gradient-text">Saeed Alame</strong> <span class="heart">&hearts;</span> &copy; ' + year + '</span>' +
        '<a class="to-top" href="#" aria-label="Back to top"><i class="bi bi-arrow-up"></i></a>' +
      '</div>' +
    '</div>';

  var footer = document.getElementById("site-footer");
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML = footerHtml;
  }

})();
