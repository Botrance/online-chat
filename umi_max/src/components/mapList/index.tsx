import { friendType, msgType, roomType } from '@/global/define';
import React, { useEffect } from 'react';

interface RoomListProps {
  rooms: roomType[];
  selectedRoomId: string | null;
  onRoomClick: (roomId: string) => void;
}

interface MsgListProps {
  msgs: msgType[];
  username: string | null;
}

interface FriendListProps {
  friends: friendType[];
  selectedFriendName: string | null;
  onFriendClick: (roomId: string) => void;
}

export const RoomList: React.FC<RoomListProps> = React.memo(
  ({ rooms, selectedRoomId, onRoomClick }) => {
    useEffect(() => {
      if (!selectedRoomId && rooms.length > 0) {
        onRoomClick(rooms[0].roomId);
      }
    }, [selectedRoomId, rooms, onRoomClick]);

    return (
      <>
        {rooms.map((room) => (
          <div
            className="room-card"
            key={room.roomId}
            style={{
              backgroundColor:
                room.roomId === selectedRoomId
                  ? 'rgb(235, 235, 235)'
                  : 'rgb(248, 249, 249)',
            }}
            onClick={() => onRoomClick(room.roomId)}
          >
            {room.roomName}
          </div>
        ))}
      </>
    );
  },
);

export const MsgList: React.FC<MsgListProps> = React.memo(
  ({ msgs, username }) => {
    return (
      <>
        {msgs ? (
          msgs.map((msg) => (
            <div
              key={msg.id}
              className={`msg-card ${
                msg.sender === username ? 'sent' : 'received'
              }`}
            >
              {msg.message}
            </div>
          ))
        ) : (
          <></>
        )}
      </>
    );
  },
);

export const FriendList: React.FC<FriendListProps> = React.memo(
  ({ friends, selectedFriendName, onFriendClick }) => {
    return (
      <>
        {friends ? (
          friends.map((friend) => (
            <div
              className="room-card"
              key={friend.minorId}
              style={{
                backgroundColor:
                  friend.minorId === selectedFriendName
                    ? 'rgb(235, 235, 235)'
                    : 'rgb(248, 249, 249)',
              }}
              onClick={() => onFriendClick(friend.minorId)}
            >
              {friend.minorId}
            </div>
          ))
        ) : (
          <></>
        )}
      </>
    );
  },
);
