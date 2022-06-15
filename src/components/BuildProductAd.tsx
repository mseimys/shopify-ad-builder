import { ResourcePicker, useAppBridge } from "@shopify/app-bridge-react";
import { getSessionToken } from "@shopify/app-bridge-utils";
import { SelectPayload } from "@shopify/app-bridge/actions/ResourcePicker";
import { Button, Card, Page, Modal } from "@shopify/polaris";
import { useEffect, useState } from "react";

import { AdBuilder } from "./AdBuilder";
import { Menu } from "./Menu";

export function BuildProductAd() {
  const [resultUrl, setResultUrl] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const app = useAppBridge();

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

  const handleBuildAd = async () => {
    const token = await getSessionToken(app);

    const response = await fetch("/generate-ad", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => res.json());
    setResultUrl(response.url);
  };

  return (
    <Page fullWidth>
      <Menu />
      {resultUrl && (
        <Modal title="Result" open onClose={() => setResultUrl("")}>
          <Modal.Section>
            <img src={resultUrl} width="500" />
          </Modal.Section>
        </Modal>
      )}
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
        primaryFooterAction={
          productId
            ? {
                content: "Build Ad",
                onAction: handleBuildAd,
              }
            : undefined
        }
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
          <>
            <p>Create Ad for {productId}</p>
            <AdBuilder productId={productId} />
          </>
        ) : (
          <Button onClick={() => setIsSelectOpen(true)}>Select Product</Button>
        )}
      </Card>
    </Page>
  );
}
