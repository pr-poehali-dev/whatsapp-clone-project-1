import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  isGroup?: boolean;
  members?: string[];
}

interface Message {
  id: number;
  text?: string;
  time: string;
  sent: boolean;
  type: 'text' | 'voice' | 'file';
  duration?: string;
  fileName?: string;
}

const mockChats: Chat[] = [
  { id: 1, name: 'Анна Смирнова', avatar: '', lastMessage: 'Привет! Как дела?', time: '14:23', unread: 2, online: true },
  { id: 2, name: 'Команда Проекта', avatar: '', lastMessage: 'Встреча перенесена на 15:00', time: '13:45', unread: 0, online: false, isGroup: true, members: ['Анна', 'Дмитрий', 'Мария'] },
  { id: 3, name: 'Дмитрий Иванов', avatar: '', lastMessage: 'Отправил файлы', time: '12:30', unread: 5, online: true },
  { id: 4, name: 'Мария Петрова', avatar: '', lastMessage: 'Спасибо за помощь!', time: '11:15', unread: 0, online: false },
  { id: 5, name: 'Алексей Козлов', avatar: '', lastMessage: 'Созвонимся завтра?', time: '10:00', unread: 1, online: true },
  { id: 6, name: 'Семья 👨‍👩‍👧‍👦', avatar: '', lastMessage: 'Все готово', time: 'Вчера', unread: 0, online: false, isGroup: true, members: ['Мама', 'Папа', 'Сестра'] },
];

export default function Index() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(mockChats[0]);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Привет! Как дела?', time: '14:20', sent: false, type: 'text' },
    { id: 2, text: 'Отлично! Работаю над новым проектом', time: '14:21', sent: true, type: 'text' },
    { id: 3, text: 'Звучит интересно! Расскажешь подробнее?', time: '14:23', sent: false, type: 'text' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [userName, setUserName] = useState('Вы');
  const [userBio, setUserBio] = useState('Всегда на связи! 📱');

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        text: newMessage,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        sent: true,
        type: 'text'
      }]);
      setNewMessage('');
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
    }, 60000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setMessages([...messages, {
      id: messages.length + 1,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      sent: true,
      type: 'voice',
      duration: `0:${recordingTime.toString().padStart(2, '0')}`
    }]);
    setRecordingTime(0);
  };

  const sendFile = () => {
    setMessages([...messages, {
      id: messages.length + 1,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      sent: true,
      type: 'file',
      fileName: 'документ.pdf'
    }]);
  };

  if (showVideoCall) {
    return (
      <div className="h-screen w-full bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        
        <div className="relative z-10 flex flex-col items-center gap-8 animate-fade-in">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl animate-scale-in">
              <Avatar className="w-28 h-28 border-4 border-white/20">
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-3xl font-semibold">
                  {selectedChat?.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-purple-900 animate-pulse" />
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">{selectedChat?.name}</h2>
            <p className="text-purple-200 text-lg">
              {selectedChat?.isGroup ? `${selectedChat.members?.length} участников` : 'Видеозвонок...'}
            </p>
          </div>

          <div className="flex gap-4 mt-8">
            <Button
              size="lg"
              className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 transition-all hover:scale-110"
            >
              <Icon name="Mic" className="text-white" size={24} />
            </Button>
            
            <Button
              size="lg"
              className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 transition-all hover:scale-110"
            >
              <Icon name="Video" className="text-white" size={24} />
            </Button>
            
            <Button
              size="lg"
              className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 transition-all hover:scale-110 shadow-xl"
              onClick={() => setShowVideoCall(false)}
            >
              <Icon name="PhoneOff" className="text-white" size={24} />
            </Button>
            
            <Button
              size="lg"
              className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 transition-all hover:scale-110"
            >
              <Icon name="Users" className="text-white" size={24} />
            </Button>
          </div>
        </div>

        <div className="absolute top-6 right-6 w-48 h-36 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-2xl border-2 border-white/20 overflow-hidden animate-slide-in-right">
          <div className="w-full h-full flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <p className="text-white/60 text-sm">Ваша камера</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="w-96 bg-white/80 backdrop-blur-xl border-r border-purple-100 flex flex-col shadow-2xl">
        <div className="p-6 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Мессенджер</h1>
            <div className="flex gap-2">
              <Dialog open={showNewGroup} onOpenChange={setShowNewGroup}>
                <DialogTrigger asChild>
                  <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 rounded-full">
                    <Icon name="UsersRound" size={20} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle>Создать групповой чат</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Название группы</Label>
                      <Input placeholder="Моя группа" className="mt-2" />
                    </div>
                    <div>
                      <Label>Участники</Label>
                      <div className="mt-2 space-y-2">
                        {mockChats.filter(c => !c.isGroup).slice(0, 4).map(chat => (
                          <div key={chat.id} className="flex items-center gap-3 p-2 hover:bg-purple-50 rounded-lg cursor-pointer">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-sm">
                                {chat.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{chat.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      Создать группу
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 rounded-full">
                    <Icon name="Settings" size={20} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle>Настройки профиля</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex flex-col items-center gap-4">
                      <Avatar className="w-24 h-24 border-4 border-purple-200">
                        <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-3xl font-semibold">
                          {userName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50">
                        <Icon name="Camera" className="mr-2" size={16} />
                        Изменить фото
                      </Button>
                    </div>
                    <div>
                      <Label>Имя</Label>
                      <Input 
                        value={userName} 
                        onChange={(e) => setUserName(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>О себе</Label>
                      <Textarea 
                        value={userBio} 
                        onChange={(e) => setUserBio(e.target.value)}
                        className="mt-2"
                        rows={3}
                      />
                    </div>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      Сохранить
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="relative">
            <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-200" size={18} />
            <Input 
              placeholder="Поиск чатов..." 
              className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-purple-200 focus:bg-white/30"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {mockChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`w-full p-4 rounded-2xl mb-2 flex items-start gap-3 transition-all hover:scale-[1.02] ${
                  selectedChat?.id === chat.id
                    ? 'bg-gradient-to-r from-purple-100 to-pink-100 shadow-md'
                    : 'hover:bg-purple-50/50'
                }`}
              >
                <div className="relative">
                  <Avatar className="w-14 h-14 border-2 border-white shadow-lg">
                    <AvatarFallback className={`${chat.isGroup ? 'bg-gradient-to-br from-blue-400 to-indigo-400' : 'bg-gradient-to-br from-purple-400 to-pink-400'} text-white font-semibold`}>
                      {chat.isGroup ? <Icon name="Users" size={24} /> : chat.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {chat.online && !chat.isGroup && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-800 truncate">{chat.name}</h3>
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{chat.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && (
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                    {chat.unread}
                  </div>
                )}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col bg-white/60 backdrop-blur-sm">
        {selectedChat ? (
          <>
            <div className="p-6 bg-white/90 backdrop-blur-xl border-b border-purple-100 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12 border-2 border-purple-200 shadow-md">
                  <AvatarFallback className={`${selectedChat.isGroup ? 'bg-gradient-to-br from-blue-400 to-indigo-400' : 'bg-gradient-to-br from-purple-400 to-pink-400'} text-white font-semibold`}>
                    {selectedChat.isGroup ? <Icon name="Users" size={20} /> : selectedChat.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-gray-800 text-lg">{selectedChat.name}</h2>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    {selectedChat.isGroup ? (
                      <span>{selectedChat.members?.length} участников</span>
                    ) : (
                      <>
                        <span className={`w-2 h-2 ${selectedChat.online ? 'bg-green-500 animate-pulse' : 'bg-gray-400'} rounded-full`} />
                        {selectedChat.online ? 'В сети' : 'Не в сети'}
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="icon" 
                  className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all hover:scale-110 shadow-lg"
                  onClick={() => setShowVideoCall(true)}
                >
                  <Icon name="Video" className="text-white" size={20} />
                </Button>
                <Button 
                  size="icon" 
                  className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all hover:scale-110 shadow-lg"
                >
                  <Icon name="Phone" className="text-white" size={20} />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full hover:bg-purple-100">
                  <Icon name="MoreVertical" size={20} />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sent ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div
                      className={`max-w-md px-5 py-3 rounded-3xl shadow-md ${
                        message.sent
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-lg'
                          : 'bg-white border border-purple-100 text-gray-800 rounded-bl-lg'
                      }`}
                    >
                      {message.type === 'text' && (
                        <>
                          <p className="mb-1">{message.text}</p>
                          <p className={`text-xs ${message.sent ? 'text-purple-100' : 'text-gray-500'} text-right`}>
                            {message.time}
                          </p>
                        </>
                      )}
                      {message.type === 'voice' && (
                        <div className="flex items-center gap-3 min-w-[200px]">
                          <Button size="icon" variant="ghost" className={`rounded-full ${message.sent ? 'text-white hover:bg-white/20' : 'text-purple-600 hover:bg-purple-50'}`}>
                            <Icon name="Play" size={20} />
                          </Button>
                          <div className="flex-1 h-8 flex items-center gap-1">
                            {[...Array(20)].map((_, i) => (
                              <div key={i} className={`w-1 ${message.sent ? 'bg-white/60' : 'bg-purple-300'} rounded-full`} style={{ height: `${Math.random() * 100}%` }} />
                            ))}
                          </div>
                          <span className={`text-xs ${message.sent ? 'text-purple-100' : 'text-gray-500'}`}>{message.duration}</span>
                        </div>
                      )}
                      {message.type === 'file' && (
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-full ${message.sent ? 'bg-white/20' : 'bg-purple-100'} flex items-center justify-center`}>
                            <Icon name="FileText" size={24} className={message.sent ? 'text-white' : 'text-purple-600'} />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{message.fileName}</p>
                            <p className={`text-xs ${message.sent ? 'text-purple-100' : 'text-gray-500'}`}>{message.time}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-6 bg-white/90 backdrop-blur-xl border-t border-purple-100">
              {isRecording ? (
                <div className="flex gap-3 items-center animate-fade-in">
                  <div className="flex-1 flex items-center gap-4 bg-red-50 border border-red-200 rounded-full px-6 py-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-red-600 font-semibold">
                      Запись... 0:{recordingTime.toString().padStart(2, '0')}
                    </span>
                    <div className="flex-1 h-2 bg-red-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all" style={{ width: `${(recordingTime / 60) * 100}%` }} />
                    </div>
                  </div>
                  <Button
                    size="icon"
                    className="rounded-full w-12 h-12 bg-red-500 hover:bg-red-600 transition-all hover:scale-110 shadow-lg flex-shrink-0"
                    onClick={stopRecording}
                  >
                    <Icon name="Send" className="text-white" size={20} />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-3 items-center">
                  <Button size="icon" variant="ghost" className="rounded-full hover:bg-purple-100 flex-shrink-0">
                    <Icon name="Smile" size={22} />
                  </Button>
                  <Button size="icon" variant="ghost" className="rounded-full hover:bg-purple-100 flex-shrink-0" onClick={sendFile}>
                    <Icon name="Paperclip" size={22} />
                  </Button>
                  <Input
                    placeholder="Введите сообщение..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1 rounded-full border-purple-200 focus:border-purple-400 px-6 py-6"
                  />
                  <Button
                    size="icon"
                    className="rounded-full w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 transition-all hover:scale-110 shadow-lg flex-shrink-0"
                    onMouseDown={startRecording}
                  >
                    <Icon name="Mic" className="text-white" size={20} />
                  </Button>
                  <Button
                    size="icon"
                    className="rounded-full w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all hover:scale-110 shadow-lg flex-shrink-0"
                    onClick={sendMessage}
                  >
                    <Icon name="Send" className="text-white" size={20} />
                  </Button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                <Icon name="MessageCircle" size={64} className="text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Выберите чат</h2>
              <p className="text-gray-600">Начните общение с друзьями</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
