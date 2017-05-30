
Polymer({
    is: 'plussub-demo',
    ready:function(){
      this.loadContentScript();
    },
    loadContentScript: function () {
        var linkElement = document.createElement('link');
        linkElement.setAttribute("rel", "import");
        linkElement.setAttribute("href", "part/content.html");
        document.querySelector('body').appendChild(linkElement);
    },
});