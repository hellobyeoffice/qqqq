import { useState } from "react";
import { useNavigate } from "react-router";
import { Calendar, Camera, Clock, ImageOff, LogOut, Mail, MapPin } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function Profile() {
  const navigate = useNavigate();
  const { logout, user, uploadedPhotos } = useAuth();
  const myPhotos = user ? uploadedPhotos.filter((photo) => photo.user_id === user.id) : [];
  const [name, setName] = useState(user?.name ?? "User");
  const [email, setEmail] = useState(user?.email ?? "user@example.com");
  const [location, setLocation] = useState("Seoul");
  const [bio, setBio] = useState("I like photos.");
  const [isEditing, setIsEditing] = useState(false);
  const totalLikes = myPhotos.reduce((sum, photo) => sum + photo.likesCount, 0);
  const totalShares = myPhotos.reduce((sum, photo) => sum + photo.sharesCount, 0);
  const handleSave = () => { setIsEditing(false); alert("Profile saved."); };
  const handleLogout = () => { logout(); alert("Logged out."); navigate("/"); };

  return (
    <div className="pt-20 pb-12 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-blue-500 to-slate-700" />
          <div className="px-8 pb-8">
            <div className="flex items-end justify-between -mt-16 mb-6">
              <div className="relative"><img src={user?.avatar ?? "https://i.pravatar.cc/150?img=10"} alt="Profile" className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover" /><button className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"><Camera className="w-4 h-4" /></button></div>
              {!isEditing ? <button onClick={() => setIsEditing(true)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Edit profile</button> : <div className="flex gap-2"><button onClick={() => setIsEditing(false)} className="px-6 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button><button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Save</button></div>}
            </div>
            <div className="space-y-6">
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>{isEditing ? <input value={name} onChange={(event) => setName(event.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /> : <p className="text-2xl font-bold text-gray-900 dark:text-white">{name}</p>}</div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"><Mail className="w-4 h-4 inline mr-2" />Email</label>{isEditing ? <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /> : <p className="text-gray-700 dark:text-gray-300">{email}</p>}</div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"><MapPin className="w-4 h-4 inline mr-2" />Location</label>{isEditing ? <input value={location} onChange={(event) => setLocation(event.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /> : <p className="text-gray-700 dark:text-gray-300">{location}</p>}</div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>{isEditing ? <textarea value={bio} onChange={(event) => setBio(event.target.value)} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /> : <p className="text-gray-700 dark:text-gray-300">{bio}</p>}</div>
              <div className="flex items-center gap-2 text-sm text-gray-500"><Calendar className="w-4 h-4" /><span>Joined: {user ? new Date(user.created_at).toLocaleDateString("en-US") : "-"}</span>{user?.role === "ADMIN" && <span className="ml-2 px-2 py-1 rounded-full bg-gray-900 text-white text-xs">ADMIN</span>}</div>
            </div>
          </div>
        </div>
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">My photos</h2>
          {myPhotos.length === 0 ? <div className="flex flex-col items-center justify-center py-16 text-gray-400"><ImageOff className="w-16 h-16 mb-4" /><p className="text-lg font-medium">No photos yet.</p></div> : <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">{myPhotos.map((photo) => <div key={photo.id} className="group relative rounded-lg overflow-hidden aspect-square bg-gray-100"><img src={photo.image_url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /><div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-2 opacity-0 group-hover:opacity-100"><p className="text-white text-xs truncate">{photo.uploadedAt}</p></div></div>)}</div>}
        </div>
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"><h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Stats</h2><div className="grid grid-cols-3 gap-6"><div className="text-center"><p className="text-3xl font-bold text-blue-600">{myPhotos.length}</p><p className="text-sm text-gray-600 dark:text-gray-300">Photos</p></div><div className="text-center"><p className="text-3xl font-bold text-red-600">{totalLikes}</p><p className="text-sm text-gray-600 dark:text-gray-300">Likes</p></div><div className="text-center"><p className="text-3xl font-bold text-green-600">{totalShares}</p><p className="text-sm text-gray-600 dark:text-gray-300">Shares</p></div></div></div>
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"><h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Menu</h2><div className="space-y-3"><button onClick={() => navigate("/history")} className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"><Clock className="w-5 h-5" /><span>Activity history</span></button><button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><LogOut className="w-5 h-5" /><span>Logout</span></button></div></div>
      </div>
    </div>
  );
}
