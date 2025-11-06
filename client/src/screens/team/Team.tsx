import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, MoreVertical, Mail, Shield, UserX, Crown } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'accountant' | 'viewer';
  avatar: string;
  status: 'active' | 'pending' | 'inactive';
  lastActive: string;
  joinedDate: string;
}

export const TeamScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Koushith Amin',
      email: 'koushith@definvoice.com',
      role: 'owner',
      avatar: 'KA',
      status: 'active',
      lastActive: '2 minutes ago',
      joinedDate: '2023-01-10',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@definvoice.com',
      role: 'admin',
      avatar: 'SJ',
      status: 'active',
      lastActive: '1 hour ago',
      joinedDate: '2023-02-15',
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'michael@definvoice.com',
      role: 'accountant',
      avatar: 'MC',
      status: 'active',
      lastActive: '3 hours ago',
      joinedDate: '2023-03-20',
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily@definvoice.com',
      role: 'viewer',
      avatar: 'ED',
      status: 'pending',
      lastActive: 'Never',
      joinedDate: '2024-02-10',
    },
  ];

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-50 text-purple-700 ring-1 ring-purple-200/50';
      case 'admin':
        return 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/50';
      case 'accountant':
        return 'bg-green-50 text-green-700 ring-1 ring-green-200/50';
      case 'viewer':
        return 'bg-gray-50 text-gray-700 ring-1 ring-gray-200/50';
      default:
        return 'bg-gray-50 text-gray-700 ring-1 ring-gray-200/50';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-3.5 h-3.5" />;
      case 'admin':
        return <Shield className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  const getRoleLabel = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-[1100px] mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Team</h1>
              <p className="text-[14px] text-gray-500 mt-1.5">Manage your team members and their roles</p>
            </div>
            <Button
              onClick={() => setShowInviteModal(true)}
              className="h-10 px-5 bg-gradient-to-r from-[#635bff] to-[#5045e5] hover:from-[#5045e5] hover:to-[#3d38d1] text-white rounded-lg font-semibold shadow-lg shadow-[#635bff]/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Total Members</p>
            <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Active</p>
            <p className="text-2xl font-bold text-gray-900">
              {teamMembers.filter((m) => m.status === 'active').length}
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Pending</p>
            <p className="text-2xl font-bold text-gray-900">
              {teamMembers.filter((m) => m.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Admins</p>
            <p className="text-2xl font-bold text-gray-900">
              {teamMembers.filter((m) => m.role === 'admin' || m.role === 'owner').length}
            </p>
          </div>
        </div>

        {/* Team Members Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl shadow-sm overflow-hidden">
          {/* Search */}
          <div className="px-6 py-4 border-b border-gray-200/60 bg-gray-50/30">
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search team members..."
                className="h-10 w-full pl-9 text-[13px] bg-white border border-gray-300 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Team Members List */}
          <div className="divide-y divide-gray-100">
            {filteredMembers.map((member) => (
              <div key={member.id} className="px-6 py-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#635bff] to-[#5045e5] flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {member.avatar}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full ${getRoleColor(member.role)}`}>
                          {getRoleIcon(member.role)}
                          {getRoleLabel(member.role)}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(member.status)}`}>
                          {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{member.email}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Last active {member.lastActive} • Joined{' '}
                        {new Date(member.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {member.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 px-3 border-gray-300 rounded-lg text-xs"
                      >
                        <Mail className="w-3.5 h-3.5 mr-1.5" />
                        Resend Invite
                      </Button>
                    )}
                    {member.role !== 'owner' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 px-3 border-gray-300 rounded-lg"
                        >
                          Edit Role
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 w-9 p-0 border-red-200 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <UserX className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    {member.role === 'owner' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 p-0 border-gray-300 rounded-lg"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Invite Team Member</h2>
                  <p className="text-sm text-gray-500">Send an invitation to join your team</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="invite-email" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Email Address
                  </Label>
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="colleague@company.com"
                    className="h-11 border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <Label htmlFor="invite-role" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Role
                  </Label>
                  <Select defaultValue="viewer">
                    <SelectTrigger className="h-11 border-gray-300 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin - Full access</SelectItem>
                      <SelectItem value="accountant">Accountant - Can manage finances</SelectItem>
                      <SelectItem value="viewer">Viewer - Read-only access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 h-11 border-gray-300 rounded-lg"
                >
                  Cancel
                </Button>
                <Button className="flex-1 h-11 bg-gradient-to-r from-[#635bff] to-[#5045e5] hover:from-[#5045e5] hover:to-[#3d38d1] text-white rounded-lg font-semibold shadow-lg shadow-[#635bff]/20">
                  Send Invite
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
