import connect from "can-connect";
import "can-connect/constructor/";
import "can-connect/data/url/";

export default connect(["constructor","data-url"], {
  url: "/api/answer"
});
