import { ProCard } from "@ant-design/pro-components";


const RelationPage:React.FC=()=>{

  console.log('route realtion render');

  return <div className="relation-page-card" style={{ width: '100%', height: '100%' }}>
  <ProCard split="vertical">
    <ProCard colSpan="25%" split="horizontal" direction="column">
      <ProCard style={{ height: '50px' }}></ProCard>
      <ProCard
        style={{ backgroundColor: 'rgb(248, 249, 249)', zIndex: '100' }}
        ghost
      >
        {/* <RoomList
          rooms={infoModel.rooms}
          selectedRoomId={selectedRoomId}
          onRoomClick={handleRoomClick}
        /> */}
      </ProCard>
    </ProCard>

    <ProCard
      className="chat-main-area"
      colSpan="75%"
      split="horizontal"
      direction="column"
    >
    </ProCard>
  </ProCard>
</div>
}

export default RelationPage