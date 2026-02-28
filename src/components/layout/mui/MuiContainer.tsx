import { Container, ContainerProps } from "@mui/material";

export default function MuiContainer({
  children,
  sx,
  ...props
}: ContainerProps) {
  return (
    <Container disableGutters maxWidth="xl" sx={sx} {...props}>
      {children}
    </Container>
  );
}
