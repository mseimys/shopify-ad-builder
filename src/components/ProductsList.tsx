import { ResourceList, TextStyle, Stack, Thumbnail } from "@shopify/polaris";

export function ProductsList({ data }: any) {
  return (
    <ResourceList
      resourceName={{ singular: "Product", plural: "Products" }}
      items={data.nodes}
      renderItem={(item: any) => {
        const headerImage =
          item.images.edges.length > 0 ? item.images.edges[0].node.url : "";
        const headerImageAltText =
          item.images.edges.length > 0 ? item.images.edges[0].node.altText : "";

        const otherImages =
          item.images.edges.length > 1 ? item.images.edges.slice(1) : [];
        const media = (
          <Thumbnail
            source={headerImage}
            alt={headerImageAltText}
            size="large"
          />
        );
        const price = item.variants.edges[0].node.price;

        return (
          <ResourceList.Item
            id={item.id}
            media={media}
            accessibilityLabel={`View details for ${item.title}`}
            onClick={() => {
              //store.set("item", item);
              console.log("CLICK", item);
            }}
          >
            <Stack>
              <Stack.Item fill>
                <h3>
                  <TextStyle variation="strong">{item.title}</TextStyle>
                  <p>${price}</p>
                </h3>
              </Stack.Item>
              {otherImages.map((image) => (
                <Stack.Item key={image.node.url}>
                  <Thumbnail source={image.node.url} alt={image.node.altText} />
                </Stack.Item>
              ))}
            </Stack>
          </ResourceList.Item>
        );
      }}
    />
  );
}
