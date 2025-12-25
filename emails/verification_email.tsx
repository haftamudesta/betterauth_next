import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';


interface verificationEmailProps {
  verificationUrl:string,
  userName:string,
  appName?:string
}

console.log("test")
export const VerificationEmail = ({
  verificationUrl,userName,appName="Better Auth"
}: verificationEmailProps) => (
  <Html>
    <Head />
    <Tailwind >
      <Body className="bg-white font-betterAuth">
        <Preview>
          verify your email for {userName}
        </Preview>
        <Container className="mx-auto py-5 pb-12">

          <Text className="text-[16px] leading-[26px]">
            Hi {userName},
          </Text>
          <Text className="text-[16px] leading-[26px]">
            Welcome to betterAuth, thank you for signing up for {appName}.Please confirm your email by clicking the button below
          </Text>
          <Section className="text-center">
            <Button
              className="bg-[#5F51E8] rounded-[3px] text-white text-[16px] no-underline text-center block p-3"
              href={verificationUrl}
            >
              Verfiy your email
            </Button>
          </Section>
          
          <Text className="text-[#8898aa] text-[12px]">
            If you do not create an account, you can safely ignor this email
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);


export default VerificationEmail;
