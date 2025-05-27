#![no_std]
#![allow(non_snake_case)]

use soroban_sdk::{contract, contractimpl, contracttype, Env, Symbol, String, symbol_short, log};

// Project Constants
const TOTAL_LEASES: Symbol = symbol_short!("TLEASE");
const USER_REPUTATION: Symbol = symbol_short!("UREP");

// Reputation structure
#[contracttype]
#[derive(Clone)]
pub struct Reputation {
    pub total_leases: u64,
    pub successful_returns: u64,
    pub failed_returns: u64,
    pub disputes_raised: u64,
    pub trust_score: u64,
}

// Lease structure
#[contracttype]
#[derive(Clone)]
pub struct Lease {
    pub lease_id: u64,
    pub asset_name: String,
    pub owner: String,
    pub lessee: String,
    pub amount_paid: u64,
    pub lease_start: u64,
    pub lease_end: u64,
    pub is_returned: bool,
    pub is_active: bool,
    pub dispute: bool,
}

#[contracttype]
pub enum LeaseBook {
    Lease(u64),
}

#[contracttype]
pub enum DisputeBook {
    Dispute(u64),
}

// Dispute structure
#[contracttype]
#[derive(Clone)]
pub struct Dispute {
    pub lease_id: u64,
    pub raised_by: String,
    pub reason: String,
    pub resolved: bool,
    pub valid: bool,
}

#[contract]
pub struct ReputationLeaseContract;

#[contractimpl]
impl ReputationLeaseContract {
    pub fn create_lease(env: Env, asset_name: String, owner: String, lessee: String, amount_paid: u64, duration_secs: u64) -> u64 {
        let mut lease_id: u64 = env.storage().instance().get(&TOTAL_LEASES).unwrap_or(0);
        lease_id += 1;

        let now = env.ledger().timestamp();
        let lease = Lease {
            lease_id,
            asset_name,
            owner,
            lessee: lessee.clone(),
            amount_paid,
            lease_start: now,
            lease_end: now + duration_secs,
            is_returned: false,
            is_active: true,
            dispute: false,
        };

        env.storage().instance().set(&LeaseBook::Lease(lease_id), &lease);
        env.storage().instance().set(&TOTAL_LEASES, &lease_id);
        log!(&env, "Lease Created: {}", lease_id);

        lease_id
    }

    pub fn return_asset(env: Env, lease_id: u64, on_time: bool) {
        let mut lease: Lease = env.storage().instance().get(&LeaseBook::Lease(lease_id)).expect("Lease not found");

        if !lease.is_active || lease.is_returned {
            panic!("Invalid lease status");
        }

        lease.is_returned = true;
        lease.is_active = false;
        env.storage().instance().set(&LeaseBook::Lease(lease_id), &lease);

        let mut rep: Reputation = env.storage().instance().get(&(USER_REPUTATION, lease.lessee.clone())).unwrap_or(Reputation {
            total_leases: 0,
            successful_returns: 0,
            failed_returns: 0,
            disputes_raised: 0,
            trust_score: 0,
        });

        rep.total_leases += 1;
        if on_time {
            rep.successful_returns += 1;
            rep.trust_score += 10;
        } else {
            rep.failed_returns += 1;
            if rep.trust_score >= 5 {
                rep.trust_score -= 5;
            }
        }

        env.storage().instance().set(&(USER_REPUTATION, lease.lessee.clone()), &rep);
        log!(&env, "Lease Returned: {}, on_time: {}", lease_id, on_time);
    }

    pub fn raise_dispute(env: Env, lease_id: u64, raised_by: String, reason: String) {
        let mut lease: Lease = env.storage().instance().get(&LeaseBook::Lease(lease_id)).expect("Lease not found");

        if !lease.is_active || lease.dispute {
            panic!("Lease inactive or already under dispute");
        }

        lease.dispute = true;
        env.storage().instance().set(&LeaseBook::Lease(lease_id), &lease);

        let dispute = Dispute {
            lease_id,
            raised_by: raised_by.clone(),
            reason,
            resolved: false,
            valid: false,
        };

        env.storage().instance().set(&DisputeBook::Dispute(lease_id), &dispute);

        let mut rep = env.storage().instance().get(&(USER_REPUTATION, raised_by.clone())).unwrap_or(Reputation {
            total_leases: 0,
            successful_returns: 0,
            failed_returns: 0,
            disputes_raised: 0,
            trust_score: 0,
        });

        rep.disputes_raised += 1;
        env.storage().instance().set(&(USER_REPUTATION, raised_by), &rep);
        log!(&env, "Dispute raised for Lease ID: {}", lease_id);
    }

    pub fn resolve_dispute(env: Env, lease_id: u64, valid: bool) {
        let mut dispute: Dispute = env.storage().instance().get(&DisputeBook::Dispute(lease_id)).expect("Dispute not found");
        let mut lease: Lease = env.storage().instance().get(&LeaseBook::Lease(lease_id)).expect("Lease not found");

        if dispute.resolved {
            panic!("Dispute already resolved");
        }

        dispute.resolved = true;
        dispute.valid = valid;
        lease.is_active = false;

        env.storage().instance().set(&DisputeBook::Dispute(lease_id), &dispute);
        env.storage().instance().set(&LeaseBook::Lease(lease_id), &lease);

        log!(&env, "Dispute resolved for Lease ID: {}, valid: {}", lease_id, valid);
    }

    pub fn view_lease(env: Env, lease_id: u64) -> Lease {
        env.storage().instance().get(&LeaseBook::Lease(lease_id)).expect("Lease not found")
    }

    pub fn view_dispute(env: Env, lease_id: u64) -> Dispute {
        env.storage().instance().get(&DisputeBook::Dispute(lease_id)).expect("Dispute not found")
    }

    pub fn view_reputation(env: Env, user: String) -> Reputation {
        env.storage().instance().get(&(USER_REPUTATION, user.clone())).unwrap_or(Reputation {
            total_leases: 0,
            successful_returns: 0,
            failed_returns: 0,
            disputes_raised: 0,
            trust_score: 0,
        })
    }
}
