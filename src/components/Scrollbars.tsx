import * as React from 'react'
import { Box } from '@chakra-ui/react'
import { Scrollbars as ReactCustomScrollbars } from 'react-custom-scrollbars'

const Scrollbars = React.forwardRef(
  (
    props: React.ComponentProps<typeof ReactCustomScrollbars>,
    ref: React.ForwardedRef<ReactCustomScrollbars>,
  ) => (
    <ReactCustomScrollbars
      renderThumbVertical={(props) => (
        <Box {...props} bgColor="gray.600" borderRadius="full" />
      )}
      universal
      autoHide
      {...props}
      ref={ref}
    />
  ),
)

export { ReactCustomScrollbars }

export default Scrollbars
