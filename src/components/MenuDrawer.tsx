import * as React from 'react'
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react'

import { secondaryHeaderLinks, socialPlatforms } from './Header'
import { footerLinks } from './FooterLinks'

export default function FooterLinks({ isOpen, onClose }) {
  return (
    <Drawer placement="right" isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent maxW="12rem">
          <DrawerCloseButton />
          <DrawerBody py={3}>
            <VStack spacing={4} align="flex-start">
              <VStack align="flex-start">{secondaryHeaderLinks}</VStack>
              <VStack align="flex-start" color="orangeYellow.600">
                {footerLinks}
              </VStack>
              <SimpleGrid columns={3} spacing={1} width="min-content">
                {socialPlatforms}
              </SimpleGrid>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  )
}
