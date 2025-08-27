import { Box, Typography, styled } from "@mui/material";
import { useDeviceTypeDetection } from "device-type-detection";

const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  justifyContent: "space-between",
  textAlign: "center",
  width: "100%",
  height: "100%",
  color: theme.palette.text.default,
}));

const TitleBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "showMobileView",
})<{ showMobileView: boolean }>(({ theme, showMobileView }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: showMobileView ? "center" : "flex-start",
  justifyContent: "center",
  width: "100%",
  textAlign: showMobileView ? "center" : "left",
  color: theme.palette.text.default,
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: "32px !important",
  fontWeight: 600,
  lineHeight: "24px !important",
  color: theme.palette.text.default,
  marginBottom: theme.spacing(2),
}));

const SubTitle = styled(Typography)(({ theme }) => ({
  fontSize: "24px !important",
  fontWeight: 400,
  lineHeight: "32px !important",
  letterSpacing: "0.115px",
  color: theme.palette.text.information,
  marginBottom: theme.spacing(3),
}));

const Information = styled(Typography)(({ theme }) => ({
  fontSize: "18px !important",
  fontWeight: 400,
  lineHeight: "24px !important",
  letterSpacing: "0.115px",
  color: theme.palette.text.default,
  marginBottom: theme.spacing(1),
}));

const WelcomeForm = () => {
  const { isMobile, isTabletVertical } = useDeviceTypeDetection();

  const showMobileView = isMobile || isTabletVertical;

  return (
    <Wrapper>
      <TitleBox showMobileView={showMobileView}>
        <Title>Anmeldung der BSO</Title>
        <SubTitle>Schließen Sie in 10 Schritten ihre Anmeldung ab.</SubTitle>
        <Information>
          In den nachfolgenden Schritten wirst du nach und nach durch deine
          Schulanmeldung geführt.
        </Information>

        <Information>
          Dort werden dir deine eigenen Daten angezeigt und du kannst veraltete
          oder falsche Daten einfach abändern.
        </Information>

        <Information>
          Solltest du bemerken, dass du etwas versehentlich abgeändert hast,
          kannst du einfach zurück gehen und diese erneut abändern.
        </Information>

        <Information>
          Solltest du dennoch Hilfe brauchen, spreche einfach deinen Lehrer
          darauf an.
        </Information>
      </TitleBox>
    </Wrapper>
  );
};

export default WelcomeForm;
