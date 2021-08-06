import { Ability, AbilityBuilder } from '@casl/ability';
import { createContext, useEffect } from 'react';
import { createContextualCan } from '@casl/react';
import { useAppSelector } from '../../store/app.hooks';
import { userSelector } from '../../store/administration/administration.reducer';
import { IMenu, IMenuRight } from '../../services/administration/menu/menu.model';

const ability = new Ability();
export default ability;

const AbilityContext = createContext({});
const Can = createContextualCan(AbilityContext.Consumer);

export { AbilityContext, Can };

export const UpdateAbility = () => {
  const userDetails = useAppSelector(userSelector);

  const updateAbility = (menus: IMenu[]) => {
    const { can, rules } = new AbilityBuilder(Ability);

    // Set the permission
    menus.map((menu: IMenu) => {
      if (menu.status) {
        menu.menu_rights.map((right: IMenuRight) => {
          if (right.is_rights && right.access_rights.status) {
            can(right.access_rights.name, menu.name);
          }
        });
      }
    });

    ability.update(rules);
  };

  useEffect(() => {
    if (userDetails.getMenuRight.data) {
      updateAbility(userDetails.getMenuRight.data.menus);
    }
  }, [userDetails.getMenuRight.data]);

  return null;
};
