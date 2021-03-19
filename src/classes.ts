import { Carrier } from 'mount/roles/role.porter';
import { Upgrader } from 'mount/roles/controller.keeper';
import { RemoteCarrier } from 'mount/roles/remoteCarrier';
import { remoteMiner } from 'mount/roles/remoteMiner';
import { remoteProtector } from 'mount/roles/remoteProtector';
import { reserve } from 'mount/roles/reserver';
import { builder } from 'mount/roles/role.builder';
import { Manager } from 'mount/roles/role.energyTransfer';
import { harvester } from 'mount/roles/role.harvester';
import { Repairer } from 'mount/roles/role.maintainer';
import { Mineraler } from 'mount/roles/role.mineral';
import { Scort } from 'mount/roles/role.scout';
import { WallPainter } from 'mount/roles/role.wallPainter';
import { attacker } from 'mount/war/Attacker';
import { Stealer } from 'mount/roles/roleStealer';
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
