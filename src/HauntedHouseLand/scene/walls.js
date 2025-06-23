import * as THREE from "three";
import * as CANNON from "cannon-es";

export function createWalls(house, world, wallTexture) {
  // Wall size
  const wallWidth = 4;
  const wallHeight = 2.5;
  const wallDepth = 4;
  const doorWidth = 1.073;
  const wallThickness = 0.1;

  // Create walls
  const walls = {
    meshes: {},
    bodies: {},
  };

  // Calculate side wall width
  const sideWallWidth = (wallWidth - doorWidth) / 2;

  // Front wall (left and right parts)
  walls.meshes.leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(sideWallWidth, wallHeight, wallThickness),
    new THREE.MeshStandardMaterial({ map: wallTexture })
  );
  walls.meshes.leftWall.position.set(
    -(wallWidth / 2 - sideWallWidth / 2),
    wallHeight / 2,
    wallDepth / 2
  );
  house.add(walls.meshes.leftWall);

  walls.meshes.rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(sideWallWidth, wallHeight, wallThickness),
    new THREE.MeshStandardMaterial({ map: wallTexture })
  );
  walls.meshes.rightWall.position.set(
    wallWidth / 2 - sideWallWidth / 2,
    wallHeight / 2,
    wallDepth / 2
  );
  house.add(walls.meshes.rightWall);

  // Back wall
  walls.meshes.backWall = new THREE.Mesh(
    new THREE.BoxGeometry(wallWidth, wallHeight, wallThickness),
    new THREE.MeshStandardMaterial({ map: wallTexture })
  );
  walls.meshes.backWall.position.set(0, wallHeight / 2, -wallDepth / 2);
  house.add(walls.meshes.backWall);

  // Left side wall
  walls.meshes.leftSideWall = new THREE.Mesh(
    new THREE.BoxGeometry(wallThickness, wallHeight, wallDepth),
    new THREE.MeshStandardMaterial({ map: wallTexture })
  );
  walls.meshes.leftSideWall.position.set(-wallWidth / 2, wallHeight / 2, 0);
  house.add(walls.meshes.leftSideWall);

  // Right side wall
  walls.meshes.rightSideWall = new THREE.Mesh(
    new THREE.BoxGeometry(wallThickness, wallHeight, wallDepth),
    new THREE.MeshStandardMaterial({ map: wallTexture })
  );
  walls.meshes.rightSideWall.position.set(wallWidth / 2, wallHeight / 2, 0);
  house.add(walls.meshes.rightSideWall);

  // Create physics collision bodies
  walls.bodies.leftWall = new CANNON.Body({
    shape: new CANNON.Box(
      new CANNON.Vec3(sideWallWidth / 2, wallHeight / 2, wallThickness / 2)
    ),
    type: CANNON.Body.STATIC,
    position: new CANNON.Vec3(
      -(wallWidth / 2 - sideWallWidth / 2),
      wallHeight / 2,
      wallDepth / 2
    ),
  });
  world.addBody(walls.bodies.leftWall);

  walls.bodies.rightWall = new CANNON.Body({
    shape: new CANNON.Box(
      new CANNON.Vec3(sideWallWidth / 2, wallHeight / 2, wallThickness / 2)
    ),
    type: CANNON.Body.STATIC,
    position: new CANNON.Vec3(
      wallWidth / 2 - sideWallWidth / 2,
      wallHeight / 2,
      wallDepth / 2
    ),
  });
  world.addBody(walls.bodies.rightWall);

  // Back wall physics body
  walls.bodies.backWall = new CANNON.Body({
    shape: new CANNON.Box(
      new CANNON.Vec3(wallWidth / 2, wallHeight / 2, wallThickness / 2)
    ),
    type: CANNON.Body.STATIC,
    position: new CANNON.Vec3(0, wallHeight / 2, -wallDepth / 2),
  });
  world.addBody(walls.bodies.backWall);

  // Left side wall physics body
  walls.bodies.leftSideWall = new CANNON.Body({
    shape: new CANNON.Box(
      new CANNON.Vec3(wallThickness / 2, wallHeight / 2, wallDepth / 2)
    ),
    type: CANNON.Body.STATIC,
    position: new CANNON.Vec3(-wallWidth / 2, wallHeight / 2, 0),
  });
  world.addBody(walls.bodies.leftSideWall);

  // Right side wall physics body
  walls.bodies.rightSideWall = new CANNON.Body({
    shape: new CANNON.Box(
      new CANNON.Vec3(wallThickness / 2, wallHeight / 2, wallDepth / 2)
    ),
    type: CANNON.Body.STATIC,
    position: new CANNON.Vec3(wallWidth / 2, wallHeight / 2, 0),
  });
  world.addBody(walls.bodies.rightSideWall);

  // Lintel
  const doorHeight = 1.653;
  const lintelHeight = wallHeight - doorHeight;
  const lintelWidth = doorWidth;
  const lintelThickness = wallThickness;

  const lintel = new THREE.Mesh(
    new THREE.BoxGeometry(lintelWidth, lintelHeight, lintelThickness),
    new THREE.MeshStandardMaterial({ map: wallTexture })
  );
  lintel.position.set(0, doorHeight + lintelHeight / 2, wallDepth / 2);
  house.add(lintel);

  const lintelBody = new CANNON.Body({
    shape: new CANNON.Box(
      new CANNON.Vec3(lintelWidth / 2, lintelHeight / 2, lintelThickness / 2)
    ),
    type: CANNON.Body.STATIC,
    position: new CANNON.Vec3(0, doorHeight + lintelHeight / 2, wallDepth / 2),
  });
  world.addBody(lintelBody);

  return walls;
}
