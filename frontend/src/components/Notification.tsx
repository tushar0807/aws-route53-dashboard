import { Card } from '@mantine/core'

const Notifications = ({msg , color } : {msg : string , color : string}) => {
  return (
    <Card shadow='lg' style={{backgroundColor : color , maxWidth : '40vw'}} padding={'lg' } withBorder>
        {msg}
    </Card>
  )
}

export default Notifications