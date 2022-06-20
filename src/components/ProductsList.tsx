import { TextStyle, Grid, Stack, Heading } from "@shopify/polaris";

import { Image } from "./Image";

export function ProductsList({ data }: any) {
  const products = data.nodes;
  return products.map((item: any) => {
    const headerImage =
      item.images.edges.length > 0 ? item.images.edges[0].node.url : "";
    const otherImages =
      item.images.edges.length > 1 ? item.images.edges.slice(1) : [];

    // const price = item.variants.edges[0].node.price;
    const productId = item.id;

    return (
      <div key={item.id}>
        <Stack>
          <Stack.Item>
            <Heading>{item.title}</Heading>
            <TextStyle variation="strong">Main image</TextStyle>
            <Image productId={productId} url={headerImage} size="large" />
          </Stack.Item>
        </Stack>
        <br />
        <br />
        <Grid>
          {otherImages.map((image) => (
            <Grid.Cell
              key={image.node.url}
              columnSpan={{
                xs: 2,
                sm: 2,
                md: 2,
                lg: 4,
                xl: 4,
              }}
            >
              <Image productId={productId} url={image.node.url} size="large" />
            </Grid.Cell>
          ))}
        </Grid>
      </div>
    );
  });
}
