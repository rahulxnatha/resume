
/* ===========================
File: player.js
Purpose: first-person controller (pointer lock + WASD + gravity + jump)
=========================== */
(() => {
  const state = { forward:false, back:false, left:false, right:false, jump:false, sprint:false };
  const GRAVITY = 30, JUMP_VELOCITY = 10, SPEED = 8, SPRINT = 14;

  window.RN_Player = class Player {
    constructor(camera, dom){
      this.camera = camera;
      this.controls = new window.PointerLockControls(camera, dom);
      this.velocity = new THREE.Vector3();
      this.direction = new THREE.Vector3();
      this.canJump = false;
    }
    lock(){ this.controls.lock(); }
    get isLocked(){ return this.controls.isLocked; }
    addTo(scene){ scene.add(this.controls.getObject()); }
    onKey(e, down){
      switch(e.code){
        case 'KeyW': state.forward = down; break;
        case 'KeyS': state.back = down; break;
        case 'KeyA': state.left = down; break;
        case 'KeyD': state.right = down; break;
        case 'ShiftLeft': case 'ShiftRight': state.sprint = down; break;
        case 'Space': if (down && this.canJump){ this.velocity.y += JUMP_VELOCITY; this.canJump = false; } break;
      }
    }
    update(delta){
      this.velocity.x -= this.velocity.x * 10.0 * delta;
      this.velocity.z -= this.velocity.z * 10.0 * delta;
      this.velocity.y -= GRAVITY * delta;

      this.direction.z = Number(state.forward) - Number(state.back);
      this.direction.x = Number(state.right) - Number(state.left);
      this.direction.normalize();

      const speed = state.sprint ? SPRINT : SPEED;
      if (state.forward || state.back) this.velocity.z -= this.direction.z * speed * delta;
      if (state.left || state.right) this.velocity.x -= this.direction.x * speed * delta;

      const obj = this.controls.getObject();
      obj.translateX(this.velocity.x * delta);
      obj.translateZ(this.velocity.z * delta);

      obj.position.y += this.velocity.y * delta;
      if (obj.position.y < 1.6){ // ground collision
        this.velocity.y = 0; obj.position.y = 1.6; this.canJump = true;
      }
    }
  };
})();
