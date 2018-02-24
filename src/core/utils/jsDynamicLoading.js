function loader(url) {
	return new Promise((resolve, reject) => {
	  if (window.wx && typeof window.wx === "object") {
			resolve();
			return;
	  }
	  const dom = document.createElement("script");
	  dom.setAttribute("src", url);
	  dom.onload = dom.onreadystatechange = function() {
			if (
		  !this.readyState ||
		  this.readyState === "loaded" ||
		  this.readyState === "complete"
			) {
		  resolve();
		  dom.onload = dom.onreadystatechange = null;
			}
	  };
	  dom.onerror = () => reject("页面无法载入");
	  document.getElementsByTagName("head")[0].appendChild(dom);
	});
}

export default loader;
