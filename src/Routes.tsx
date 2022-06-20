import { Switch, Route, withRouter } from "react-router-dom";
import {
  useClientRouting,
  useRoutePropagation,
} from "@shopify/app-bridge-react";

import { Home } from "./components/Home";
import { TBD } from "./components/TBD";
import { BuildProductAd } from "./components/BuildProductAd";

function Routes(props) {
  const { history, location } = props;

  useClientRouting(history);
  useRoutePropagation(location);

  return (
    <Switch>
      <Route path="/creatives" component={TBD} />
      <Route path="/audiences" component={TBD} />
      <Route path="/product-ad" component={BuildProductAd} />
      <Route path="/" component={BuildProductAd} />
    </Switch>
  );
}

export default withRouter(Routes);
