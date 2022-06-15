import { Card } from "@shopify/polaris";
import { Link } from "react-router-dom";

const Separator = () => <span> - </span>;

export function Menu() {
  return (
    <Card>
      <div style={{ padding: "12px" }}>
        <Link to="/">Home</Link>
        <Separator />
        <Link to="/creatives">Creative Hub</Link>
        <Separator />
        <Link to="/audiences">Audience Hub</Link>
        <Separator />
        <Link to="/product-ad">Build Product Ad</Link>
      </div>
    </Card>
  );
}
