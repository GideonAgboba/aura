import clsx from 'clsx';
import {motion} from 'framer-motion';
import {useNavigate} from 'react-router-dom';
import React from 'react';
import {Button, ConditionalDiv, Div, Text, TextInput} from '@components';
import {MoonIcon, SunIcon, UserIcon, XMarkIcon} from '@heroicons/react/24/outline';
import {useTheme, useUser} from '@hooks';
import {getTimeOfDay} from '@lib';
import {Routes} from '@types';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const {isDark, toggleTheme} = useTheme();
  const {user, logout, updateUser} = useUser();
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [name, setName] = React.useState<string>(user?.name || '');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleToggleEdit = () => {
    setIsEditing((prev) => !prev);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSave = () => {
    if (user) {
      updateUser({...user, name}, () => setIsEditing(false));
    }
  };

  const handleLogout = () => {
    logout(() => {
      setIsEditing(false);
      navigate(`/${Routes.login}`);
    });
  };

  return (
    <Div className={clsx(styles.container, isDark && styles.dark, 'container')}>
      <Div className={styles.row}>
        <Div className={styles.contentWrapper}>
          <motion.div
            animate={{
              x: isEditing ? -300 : 0,
              opacity: isEditing ? 0 : 1,
            }}
          >
            <Text>Hi, Good {getTimeOfDay()}</Text>
            <Text type="header" className={styles.username}>
              {user?.name} 👋
            </Text>
          </motion.div>

          <motion.div
            animate={{
              x: isEditing ? 0 : 300,
              opacity: isEditing ? 1 : 0,
            }}
            style={{
              display: isEditing ? 'inline-block' : 'none',
              position: 'absolute',
              top: 0,
              width: '100%',
            }}
          >
            <TextInput
              ref={inputRef}
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSave()}
              placeholder="Enter your name"
            />
            <Div className={styles.buttonGroup}>
              <Button
                variant="secondary"
                title="Save"
                onClick={handleSave}
                titleStyle={styles.buttonText}
              />
              <Button title="Logout" onClick={handleLogout} titleStyle={styles.buttonText} />
            </Div>
          </motion.div>
        </Div>

        <motion.button
          className={styles.iconButton}
          onClick={handleToggleEdit}
          animate={{
            rotate: isEditing ? 180 : 0,
            marginTop: isEditing ? -5 : 0,
          }}
        >
          <ConditionalDiv
            if={{
              condition: isEditing,
              render: <XMarkIcon width={20} height={20} className="text" />,
            }}
            else={<UserIcon width={20} height={20} className="text" />}
          />
        </motion.button>

        <Button
          className={styles.iconButton}
          onClick={toggleTheme}
          icon={
            <ConditionalDiv
              if={{
                condition: isDark,
                render: <MoonIcon width={20} height={20} className="text-white" />,
              }}
              else={<SunIcon width={20} height={20} className="text-gray-600" />}
            />
          }
        />
      </Div>
    </Div>
  );
};
