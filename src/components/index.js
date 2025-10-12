import SvgIcon from "@/components/SvgIcon/index.vue";
import QTable from "@/components/QTable/index.vue";
import QEmpty from "@/components/QEmpty/index.vue";
import QPagination from "@/components/QPagination/index.vue";
import QueryItem from "@/components/QueryItem/index.vue";
import QPureTable from "@/components/QPureTable/index.vue";
import "virtual:svg-icons-register";
export function setupComponents(app) {
  app.component("svg-icon", SvgIcon);
  app.component("q-table", QTable);
  app.component("q-empty", QEmpty);
  app.component("q-pagination", QPagination);
  app.component("query-item", QueryItem);
  app.component("q-pure-table", QPureTable);
}
