import _ from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Gon from 'gon';
import { actions } from '../slices';

import LanguagePickerView from './LanguagePickerView';
import GameActionButtons from './GameActionButtons';
import VimModeButton from '../containers/EditorsToolbars/VimModeButton';
import DarkModeButton from '../containers/EditorsToolbars/DarkModeButton';
import { currentUserIdSelector } from '../selectors';
import PlayerPicker from './PlayerPicker';

const type = 'stairway';
const toolbarClassNames = 'btn-toolbar justify-content-between align-items-center m-1';
const editorSettingClassNames = 'btn-group align-items-center m-1';
const userInfoClassNames = 'btn-group align-items-center justify-content-end m-1';

const currentUser = Gon.getAsset('current_user');

const ModeButtons = ({ player }) => (
  <div
    className="btn-group align-items-center mr-auto"
    role="group"
    aria-label="Editor mode"
  >
    <VimModeButton player={player} />
    <DarkModeButton player={player} />
  </div>
);

const StairwayEditorToolbar = ({
  activePlayer,
  setActivePlayerId,
  players,
}) => {
  const dispatch = useDispatch();

  const playerData = useSelector(state => _.find(state.stairwayGame.game?.players, { id: activePlayer.id }));
  const currentUserId = useSelector(currentUserIdSelector);
  const changeLang = useCallback(
    ({ label: { props } }) => dispatch(actions.changeEditorLang({ editorLang: props.slug })),
    [dispatch],
  );
  const changePlayer = useCallback(
    ({ label: { props } }) => setActivePlayerId(props.user.id),
    [setActivePlayerId],
  );
  const isDisabledLanguagePicker = activePlayer.id !== currentUser.id;
  const isDisabledPlayerPicker = useMemo(
    () => players.some(player => player.id === currentUserId),
    [players, currentUserId],
  );
  const actionBtnsProps = {
    currentEditorLangSlug: playerData?.editorLang,
    checkResult: () => {},
    checkBtnStatus: 'disabled',
    resetBtnStatus: 'disabled',
    giveUpBtnStatus: 'disabled',
  };

  return (
    <>
      <div data-player-type={type}>
        <div className={toolbarClassNames} role="toolbar">
          <div
            className={editorSettingClassNames}
            role="group"
            aria-label="Editor settings"
          >
            <LanguagePickerView
              isDisabled={isDisabledLanguagePicker}
              currentLangSlug={playerData?.editorLang}
              changeLang={changeLang}
            />
          </div>

          <>
            <ModeButtons player={activePlayer} />
            <GameActionButtons {...actionBtnsProps} />
          </>

          <div
            className={userInfoClassNames}
            role="group"
            aria-label="User info"
          >
            <PlayerPicker
              isDisabled={isDisabledPlayerPicker}
              players={players}
              changePlayer={changePlayer}
              activePlayer={activePlayer}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default StairwayEditorToolbar;
