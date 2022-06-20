import { ResourcePicker, useAppBridge } from "@shopify/app-bridge-react";
import { getSessionToken } from "@shopify/app-bridge-utils";
import { SelectPayload } from "@shopify/app-bridge/actions/ResourcePicker";
import { Button, Card, Page, Modal } from "@shopify/polaris";
import { useEffect, useState } from "react";

import { AdBuilder } from "./AdBuilder";
import { Menu } from "./Menu";

export function BuildProductAd() {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [productId, setProductId] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("id")) {
      setProductId("gid://shopify/Product/" + params.get("id"));
    }
  }, []);

  const handleSelection = (resources: SelectPayload) => {
    setProductId(resources.selection[0].id);
    setIsSelectOpen(false);
  };

  return (
    <Page fullWidth>
      <Menu />
      <ResourcePicker
        resourceType="Product"
        allowMultiple={false}
        showVariants={false}
        open={isSelectOpen}
        onSelection={(resources) => handleSelection(resources)}
        onCancel={() => setIsSelectOpen(false)}
      />
      <Card
        title="Build Product Ad"
        sectioned
        secondaryFooterActions={
          productId
            ? [
                {
                  content: "Reset",
                  onAction: () => {
                    setProductId("");
                  },
                },
              ]
            : undefined
        }
      >
        {productId ? (
          <AdBuilder productId={productId} />
        ) : (
          <Button onClick={() => setIsSelectOpen(true)}>Select Product</Button>
        )}
      </Card>
    </Page>
  );
}
