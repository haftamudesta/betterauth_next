import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Tailwind,
  Text,
} from '@react-email/components';

interface otpEmailProps {
  otp:string,
}

 const OtpEmail = ({
  otp
}: otpEmailProps) => (
  <Html>
    <Head />
    <Tailwind >
      <Body className="bg-white font-betterAuth">
        <Preview>
          your login code
        </Preview>
        <Container className="mx-auto py-5 pb-12">
          <Text className="text-[16px] leading-6.5">
            Please find your  code to log in
          </Text>
          <Text className="text-[40px] leading-6.5">
            {otp},
          </Text>
          <Text className="text-[#8898aa] text-[12px]">
            If you do not request a code, you can safely ignor this email
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default OtpEmail