import * as React from 'react'
import { Box, Heading, Text, VStack } from '@chakra-ui/react'

function Rule({ title, children }) {
  return (
    <Box>
      <Heading as="h2" color="flame.400" size="sm">
        {title}
      </Heading>
      <Text>{children}</Text>
    </Box>
  )
}

export default function Rules(props: React.ComponentProps<typeof VStack>) {
  return (
    <VStack alignItems="flex-start" mb={2} spacing={4} {...props}>
      <Rule title="">
      

This page is used to inform visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service.

If you choose to use our Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that we collect is used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.

The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at WOKE unless otherwise defined in this Privacy Policy.
      </Rule>
      <Rule title="Information Collection and Use">
      For a better experience, while using our Service, we may require you to provide us with certain personally identifiable information, including but not limited to None. The information that we request will be retained by us and used as described in this privacy policy.

The app does use third party services that may collect information used to identify you.

Link to privacy policy of third party service providers used by the app

https://www.google.com/policies/privacy
https://firebase.google.com/policies/analytics
https://onesignal.com/privacy_policy

      </Rule>
      <Rule title="Log Data">
      We want to inform you that whenever you use our Service, in a case of an error in the app we collect data and information (through third party products) on your phone called Log Data. This Log Data may include information such as your device Internet Protocol (“IP”) address, device name, operating system version, the configuration of the app when utilizing our Service, the time and date of your use of the Service, and other statistics.

      </Rule>
      <Rule title="Cookies">
      Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device's internal memory.

This Service does not use these “cookies” explicitly. However, the app may use third party code and libraries that use “cookies” to collect information and improve their services. You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to refuse our cookies, you may not be able to use some portions of this Service.
      </Rule>
      <Rule title="Service Providers">
      We may employ third-party companies and individuals due to the following reasons:

*   To facilitate our Service;
*   To provide the Service on our behalf;
*   To perform Service-related services; or
*   To assist us in analyzing how our Service is used.

We want to inform users of this Service that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.
      </Rule>
      <Rule title="Security">
      We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
      </Rule>
      <Rule title="Changes to This Privacy Policy">
      We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page.
      This policy is effective as of 2021-04-20


      </Rule>
    </VStack>
  )
}
