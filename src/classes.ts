import { Carrier } from 'mount/role.porter';
import { Upgrader } from 'mount/controller.keeper';
import { RemoteCarrier } from 'mount/remoteCarrier';
import { remoteMiner } from 'mount/remoteMiner';
import { remoteProtector } from 'mount/remoteProtector';
import { reserve } from 'mount/reserver';
import { builder } from 'mount/role.builder';
import { Manager } from 'mount/role.energyTransfer';
import { harvester } from 'mount/role.harvester';
import { Repairer } from 'mount/role.maintainer';
import { Mineraler } from 'mount/role.mineral';
import { Scort } from 'mount/role.scout';
import { WallPainter } from 'mount/role.wallPainter';
import { attacker } from 'mount/war/Attacker';
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
    attacker
];
