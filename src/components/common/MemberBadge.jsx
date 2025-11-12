const MemberBadge = ({ member, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  const initial = member.name?.charAt(0).toUpperCase() || member.email?.charAt(0).toUpperCase();

  return (
    <div
      className={`${sizeClasses[size]} bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold`}
      title={member.name || member.email}
    >
      {initial}
    </div>
  );
};

export default MemberBadge;
