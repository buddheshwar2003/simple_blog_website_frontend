"use client";

interface Props {
  friends: any[];
  selectedFriend: any;
  setSelectedFriend: (friend: any) => void;
}

export default function ChatSidebar({
  friends,
  selectedFriend,
  setSelectedFriend,
}: Props) {
  return (
    <div className="w-80 bg-white border-r">
      <div className="p-4 border-b">
        <h1 className="font-bold text-xl">
          Chats
        </h1>
      </div>

      {friends?.map((friend) => (
        <div
          key={friend.id}
          onClick={() =>
            setSelectedFriend(friend)
          }
          className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-100 ${
            selectedFriend?.id === friend.id
              ? "bg-gray-100"
              : ""
          }`}
        >
          <div className="relative">
            <img
              src={
                friend.profileImage ||
                "/avatar.png"
              }
              className="w-12 h-12 rounded-full object-cover"
            />

            {friend.online && (
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
            )}
          </div>

          <div>
            <h2 className="font-medium">
              {friend.name}
            </h2>

            <p className="text-sm text-gray-500">
              {friend.online
                ? "Online"
                : "Offline"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}