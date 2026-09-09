import PropTypes from 'prop-types';

const fontOptions = ['Inter', 'Poppins', 'Montserrat', 'Lora', 'Merriweather', 'Playfair Display', 'Georgia', 'Arial'];

const AppearanceControls = ({ value, onChange }) => {
  const appearance = {
    textColor: '#0f172a',
    backgroundColor: '#ffffff',
    fontFamily: 'Inter',
    fontSize: '16',
    ...value
  };

  const change = event => onChange({ ...appearance, [event.target.name]: event.target.value });

  return (
    <fieldset className="appearance-controls">
      <legend>Landing page appearance</legend>
      <p className="appearance-controls-help">Customize the section text and surface without changing its content.</p>
      <div className="appearance-controls-grid">
        <label>
          Text color
          <span className="color-input-wrap"><input name="textColor" type="color" value={appearance.textColor} onChange={change} /><span>{appearance.textColor}</span></span>
        </label>
        <label>
          Background color
          <span className="color-input-wrap"><input name="backgroundColor" type="color" value={appearance.backgroundColor} onChange={change} /><span>{appearance.backgroundColor}</span></span>
        </label>
        <label>
          Font family
          <select name="fontFamily" value={appearance.fontFamily} onChange={change}>
            {fontOptions.map(font => <option value={font} key={font}>{font}</option>)}
          </select>
        </label>
        <label>
          Base font size
          <span className="number-input-wrap"><input name="fontSize" type="number" min="10" max="32" step="1" value={appearance.fontSize} onChange={change} /><span>px</span></span>
        </label>
      </div>
    </fieldset>
  );
};

AppearanceControls.propTypes = {
  value: PropTypes.shape({
    textColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    fontFamily: PropTypes.string,
    fontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  onChange: PropTypes.func.isRequired
};

export default AppearanceControls;
