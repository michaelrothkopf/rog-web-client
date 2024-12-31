import './SettingsBox.css';
import { COLOR_SCHEMES, useSettingStore } from '../../hooks/settingStore';
import { ChangeEvent } from 'react';
import { CurrentPage, useNavigationStore } from '../../hooks/navigationStore';

function SettingsBox() {
  const navigate = useNavigationStore((state) => state.navigate);

  const colorScheme = useSettingStore((state) => state.colorScheme);
  const setColorScheme = useSettingStore((state) => state.setColorScheme);

  const handleColorSchemeChange = (e: ChangeEvent) => {
    setColorScheme((e.currentTarget as HTMLSelectElement).value || colorScheme);
  };

  return (
    <div className='home-grid-element'>
      <h2>Settings</h2>
      <div className='settings-option'>
        <span className='settings-option-label'>Color scheme</span>
        <select
          name='color-scheme'
          className='color-scheme'
          id='select-color-scheme'
          onChange={handleColorSchemeChange}
          value={colorScheme}
        >
          {COLOR_SCHEMES.map((scheme) => (
            <option value={scheme.value} key={scheme.value}>
              {scheme.name}
            </option>
          ))}
        </select>
      </div>
      <button onClick={() => { navigate(CurrentPage.CHANGE_PASSWORD) }}>Change password</button>
    </div>
  );
}

export default SettingsBox;
