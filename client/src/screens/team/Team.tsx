import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, MoreVertical, Mail, Shield, UserX, Crown, ArrowLeft } from 'lucide-react';

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
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [activeTab, setActiveTab] = useState('team');

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
    <div className="min-h-screen bg-[#FEFFFE]">
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Team and security</h1>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('team')}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'team'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Team
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'security'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Security history
            </button>
            <button
              onClick={() => setActiveTab('apps')}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'apps'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Installed apps
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'requests'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Access requests
            </button>
          </div>
        </div>

        {/* Info banner */}
        <div className="bg-gray-50 rounded-md p-3 mb-5 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Additional team members of CryptoTally also have access to this account.
          </p>
          <button className="text-sm text-primary font-medium hover:underline whitespace-nowrap">
            View team members →
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-0 mb-5 bg-white w-fit rounded-md overflow-hidden">
          <button className="px-4 py-2 text-sm font-medium text-primary bg-blue-50">
            All members
            <span className="ml-2 text-gray-500 font-normal">{teamMembers.length}</span>
          </button>
          <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50">
            Active members
            <span className="ml-2 text-gray-500">{teamMembers.filter((m) => m.status === 'active').length}</span>
          </button>
          <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50">
            Pending invites
            <span className="ml-2 text-gray-500">{teamMembers.filter((m) => m.status === 'pending').length}</span>
          </button>
          <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50">
            Inactive members
            <span className="ml-2 text-gray-500">0</span>
          </button>
        </div>

        {/* Table header with actions */}
        <div className="bg-white">
          <div className="px-0 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 px-2.5 py-1.5 rounded-md hover:bg-gray-50">
                <Shield className="w-3.5 h-3.5" />
                <span>Roles</span>
              </button>
              <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 px-2.5 py-1.5 rounded-md hover:bg-gray-50">
                <span>Status</span>
              </button>
              <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 px-2.5 py-1.5 rounded-md hover:bg-gray-50">
                <span>Name</span>
              </button>
              <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 px-2.5 py-1.5 rounded-md hover:bg-gray-50">
                <Mail className="w-3.5 h-3.5" />
                <span>Email address</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 border-gray-300 rounded-md text-xs font-medium"
              >
                Export
              </Button>
              <Button
                onClick={() => setShowInviteModal(true)}
                className="h-8 px-3 bg-primary hover:bg-primary/90 text-white rounded-md text-xs font-medium"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Add member
              </Button>
            </div>
          </div>

          {/* Table */}
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="px-0 py-3 text-left text-xs font-medium text-gray-500">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Email address</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Roles</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Auth</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Last login</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-0 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-medium">
                        {member.avatar}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-gray-900">{member.name}</span>
                        {member.role === 'owner' && (
                          <>
                            <span className="px-1.5 py-0.5 text-[11px] bg-gray-100 text-gray-600 rounded">
                              You
                            </span>
                            <span className="px-1.5 py-0.5 text-[11px] bg-gray-100 text-gray-600 rounded">
                              Owner
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[13px] text-gray-600">{member.email}</td>
                  <td className="px-4 py-4 text-[13px] text-gray-600">
                    {member.role === 'owner' ? 'Super Administrator, + 1 others' : getRoleLabel(member.role)}
                  </td>
                  <td className="px-4 py-4 text-[13px] text-gray-600">-</td>
                  <td className="px-4 py-4 text-[13px] text-gray-600">{member.lastActive}</td>
                  <td className="px-4 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 hover:bg-gray-100 rounded"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="py-3 text-[11px] text-gray-500 border-t border-gray-200">
            Viewing 1 of 1 results
          </div>
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Invite Team Member</h2>
                <p className="text-sm text-gray-600 mt-1">Send an invitation to join your team</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="invite-email" className="text-sm font-medium text-gray-900 mb-2 block">
                    Email Address
                  </Label>
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="colleague@company.com"
                    className="h-9 border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <Label htmlFor="invite-role" className="text-sm font-medium text-gray-900 mb-2 block">
                    Role
                  </Label>
                  <Select defaultValue="viewer">
                    <SelectTrigger className="h-9 border-gray-300 rounded-md">
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
                  className="flex-1 h-9 border-gray-300 rounded-md"
                >
                  Cancel
                </Button>
                <Button className="flex-1 h-9 bg-primary hover:bg-primary/90 text-white rounded-md font-medium">
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
