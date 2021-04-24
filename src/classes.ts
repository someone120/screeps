import { Carrier } from 'mount/creep/role.porter';
import { Upgrader } from 'mount/creep/controller.keeper';
import { RemoteCarrier } from 'mount/creep/remoteCarrier';
import { remoteMiner } from 'mount/creep/remoteMiner';
import { remoteProtector } from 'mount/creep/remoteProtector';
import { reserve } from 'mount/creep/reserver';
import { builder } from 'mount/creep/role.builder';
import { Manager } from 'mount/creep/role.energyTransfer';
import { harvester } from 'mount/creep/role.harvester';
import { Repairer } from 'mount/creep/role.maintainer';
import { Mineraler } from 'mount/creep/role.mineral';
import { Scort } from 'mount/creep/role.scout';
import { WallPainter } from 'mount/creep/role.wallPainter';
import { attacker } from 'mount/war/Attacker';
import { Stealer } from 'mount/creep/roleStealer';
export const roles = [
    harvester,
    builder,
    Carrier,
    Upgrader,
    Repairer,
    remoteMiner,
    reserve,
    RemoteCarrier,
    Manager,
    Scort,
    Mineraler,
    WallPainter,
    remoteProtector,
    attacker,
    Stealer
];
