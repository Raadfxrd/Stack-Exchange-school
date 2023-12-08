import "./config";
import { utils } from "@hboictcloud/api";

]const parsedHtml: NodeList = await utils.fetchAndParseHtml("/assets/html/navbar.html");

document.body.insertBefore(parsedHtml[0], document.body.firstChild);
