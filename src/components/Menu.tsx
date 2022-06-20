import { Button, Card } from "@shopify/polaris";
import { Link } from "react-router-dom";

const Separator = () => <span> - </span>;

export function Menu() {
  return (
    <Card>
      <div style={{ padding: "12px" }}>
        <Link to="/">
          <Button plain>Home</Button>
        </Link>
        <Separator />
        <Link to="/creatives">
          <Button plain>Creative Hub</Button>
        </Link>
        <Separator />
        <Link to="/audiences">
          <Button plain>Audience Hub</Button>
        </Link>
        <Separator />
        <Link to="/product-ad">
          <Button plain>Build Product Ad</Button>
        </Link>
      </div>
    </Card>
  );
}
