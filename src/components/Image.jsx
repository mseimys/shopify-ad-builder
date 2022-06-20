import { useEffect, useState } from "react";

import { Button, Card, Modal, Thumbnail, Stack } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { getSessionToken } from "@shopify/app-bridge-utils";
import { gql, useMutation } from "@apollo/client";

function getArchetype(score) {
  const lastNumber = score.toString().slice(-1);
  if (["0", "1"].includes(lastNumber)) {
    return "Experimental Fun Seeker";
  }
  if (["2", "3", "4"].includes(lastNumber)) {
    return "Open Simplicity Seeker";
  }
  if (["5", "6"].includes(lastNumber)) {
    return "Traditional Comfort Seeker";
  }
  if (lastNumber === "7") {
    return "Organized Social Contributor";
  }
  if (lastNumber === "8") {
    return "Reactive Security Seeker";
  }
  return "Reliable Plan Maker";
}

function genScore(str) {
  const hash = str
    .split("")
    .reduce(
      (prevHash, currVal) =>
        ((prevHash << 5) - prevHash + currVal.charCodeAt(0)) | 0,
      0
    );

  return Math.abs(hash % 100);
}

const PRODUCT_APPEND_IMAGE_QUERY = gql`
  mutation productAppendImages($input: ProductAppendImagesInput!) {
    productAppendImages(input: $input) {
      newImages {
        id
      }
      product {
        id
        title
      }
    }
  }
`;

const PRODUCT_REORDER_IMAGES_QUERY = gql`
  mutation productReorderImages($id: ID!, $moves: [MoveInput!]!) {
    productReorderImages(id: $id, moves: $moves) {
      job {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export function Image({ productId, url, size }) {
  const [productAppendImages, { loading: appendImageLoading }] = useMutation(
    PRODUCT_APPEND_IMAGE_QUERY
  );

  const [productReorderImages, { loading: reorderImagesLoading }] = useMutation(
    PRODUCT_REORDER_IMAGES_QUERY
  );

  const isMutating = appendImageLoading || reorderImagesLoading;

  const app = useAppBridge();
  const [isLoading, setIsLoading] = useState(false);
  const [resultUrls, setResultUrls] = useState([]);
  const [score, setScore] = useState(undefined);

  useEffect(() => {
    const value = genScore(url);
    setScore(value);
  }, []);

  const handleCreateAd = async () => {
    console.log("Creating ad of", url);
    setIsLoading(true);

    const token = await getSessionToken(app);

    const response = await fetch("/create-ad", {
      method: "POST",
      body: JSON.stringify({ imageUrl: url }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    setResultUrls(response);
    setIsLoading(false);
  };

  const handleAddToProduct = async (url) => {
    const input = {
      id: productId,
      images: [
        {
          altText: "Genus AI Generated Ad",
          src: url,
        },
      ],
    };
    const { data } = await productAppendImages({ variables: { input } });
    const imageId = data.productAppendImages.newImages[0].id;
    console.log("New image ID", imageId);
    return imageId;
  };

  const handleMakePrimaryImage = async (url) => {
    const imageId = await handleAddToProduct(url);

    const { data } = await productReorderImages({
      variables: { id: productId, moves: { id: imageId, newPosition: "0" } },
    });

    console.log("Moved image", imageId, data);
  };

  return (
    <>
      {resultUrls.length > 0 && (
        <Modal
          title="Generated Ads"
          large
          open
          onClose={() => setResultUrls([])}
        >
          <Modal.Section>
            <Stack>
              {resultUrls.map((url) => (
                <Stack.Item>
                  <Card
                    key={url}
                    sectioned
                    primaryFooterAction={{
                      content: "Make as Primary Image",
                      onAction: () => handleMakePrimaryImage(url),
                      disabled: isMutating,
                    }}
                    secondaryFooterActions={[
                      {
                        content: "Add to Images",
                        onAction: () => handleAddToProduct(url),
                        disabled: isMutating,
                      },
                    ]}
                  >
                    <img src={url} style={{ maxWidth: "330px" }} />
                  </Card>
                </Stack.Item>
              ))}
            </Stack>
          </Modal.Section>
        </Modal>
      )}
      <Thumbnail source={url} alt="" size={size} />
      {score === undefined ? (
        <div>Scoring...</div>
      ) : (
        <>
          <div>Ad Appeal: {score}</div>
          <div>CTR: {score / 100}%</div>
          <div>{getArchetype(score)}</div>
          <Button
            monochrome
            size="slim"
            onClick={handleCreateAd}
            disabled={isLoading}
            loading={isLoading}
          >
            Create Ad Using this image
          </Button>
        </>
      )}
    </>
  );
}
